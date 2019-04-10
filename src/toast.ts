export class Toast {
    static count = 0;

    static show(jQ: JQueryStatic, text: string): void {

        const id = Math.floor(Math.random() * 100000000);

        if (Toast.count === 0) { // create the container
            jQ('body').append('<div id="toast-container"></div>');
            jQ('#toast-container')
                .css('position', 'fixed')
                .css('top', '0')
                .css('left', '0')
                .css('padding', '5px')
                .css('display', 'flex')
                .css('flex-direction', 'column')
                .css('z-index', '999');
        }

        jQ('#toast-container').append('<div id="toast_' + id + '">' + text + '</div>');
        Toast.count++;
        jQ('#toast_' + id)
            .css('padding', '10px')
            .css('background', '#333333')
            .css('font-size', '12px')
            .css('color', '#fafafa')
            .css('font-family', 'Helvetica, Arial')
            .css('cursor', 'pointer')
            .css('margin-bottom', '5px')
            .on('click', (e: JQuery.ClickEvent) => {
                jQ(e.target).hide();
            });


        setTimeout( () => {
            jQ('#toast_' + id).remove();
            Toast.count--;
            if (Toast.count === 0) {
                jQ('#toast-container').remove();
            }
        }, 5000);
    }
}
