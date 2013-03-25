iD.ui.intro.area = function(context, curtain) {

    var event = d3.dispatch('done'),
        timeouts = [];

    var step = {
        name: 'Areas'
    };

    step.enter = function() {

        var playground = [-85.63552, 41.94159],
            corner = [-85.63565411045074, 41.9417715536927];
        context.map().centerZoom(playground, 19);
        curtain.reveal('button.add-area', 'bottom', t('intro.areas.add'));

        context.on('enter.intro', addArea);

        function addArea(mode) {
            if (mode.id !== 'add-area') return;
            context.on('enter.intro', drawArea);

            var padding = 120 * Math.pow(2, context.map().zoom() - 19);
            var pointBox = iD.ui.intro.pad(context.projection(corner), padding);
            curtain.reveal(pointBox, 'right', t('intro.areas.corner'));

            context.map().on('move.intro', function() {
                padding = 120 * Math.pow(2, context.map().zoom() - 19);
                pointBox = iD.ui.intro.pad(context.projection(corner), padding);
                curtain.reveal(pointBox, 'right', t('intro.areas.corner'), 0);
            });
        }

        function drawArea(mode) {
            if (mode.id !== 'draw-area') return;
            context.on('enter.intro', enterSelect);

            var padding = 150 * Math.pow(2, context.map().zoom() - 19);
            var pointBox = iD.ui.intro.pad(context.projection(playground), padding);
            curtain.reveal(pointBox, 'right', t('intro.areas.place'));

            context.map().on('move.intro', function() {
                padding = 150 * Math.pow(2, context.map().zoom() - 19);
                pointBox = iD.ui.intro.pad(context.projection(playground), padding);
                curtain.reveal(pointBox, 'right', t('intro.areas.place'), 0);
            });
        }

        function enterSelect(mode) {
            if (mode.id !== 'select') return;
            context.map().on('move.intro', null);
            context.on('enter.intro', null);

            setTimeout(function() {
                curtain.reveal('.preset-grid-search', 'left', t('intro.areas.search'));
                d3.select('.preset-grid-search').on('keyup.intro', keySearch);
            }, 500);
        }
        
        function keySearch() {
            var first = d3.select('.grid-button-wrap:first-child');
            if (first.datum().id === 'leisure/playground') {
                curtain.reveal(first.select('.grid-entry').node(), 'left', t('intro.areas.choose'));
                d3.selection.prototype.one.call(context.history(), 'change.intro', selectedPreset);
                d3.select('.preset-grid-search').on('keyup.intro', null);
            }
        }

        function selectedPreset() {
            curtain.reveal('.pane', 'left', 'Add a name and edit some details. Click x to exit');
            context.on('exit.intro', event.done);
        }


    };

    step.exit = function() {
        context.on('enter.intro', null);
        context.on('exit.intro', null);
    };

    return d3.rebind(step, event, 'on');
};
