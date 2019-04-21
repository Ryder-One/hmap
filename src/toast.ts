export class Toast {
    static count = 0;

    static show(text: string): void {

        const id = Math.floor(Math.random() * 100000000);

        if (Toast.count === 0) { // create the container
            const body = document.querySelector('body')!;
            const _toastContainer = document.createElement('div');
            _toastContainer.setAttribute('id', 'toast-container');
            _toastContainer.setAttribute('style', 'position:fixed;top:0;left:0;padding:5px;display:flex;flex-direction:column;z-index:999');
            body.appendChild(_toastContainer);
        }

        const toastContainer = document.querySelector('#toast-container');
        if (toastContainer === null) {
            throw new Error('Cannot find toast-container div');
        }

        const newToast = document.createElement('div');
        newToast.setAttribute('id', 'toast_' + id);
        newToast.innerHTML = text;
        const styleString = 'padding:10px;background:#333333;font-size:12px;color:#fafafa;' +
            'font-family:Helvetica, Arial;cursor:pointer;margin-bottom:5px';
        newToast.setAttribute('style', styleString);
        newToast.onclick = (e: MouseEvent) => {
            if (e.target !== null) {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
            }
        };

        Toast.count++;


        setTimeout( () => {
            const toast = document.querySelector('#toast_' + id);
            if (toast !== null && toast.parentNode !== null) {
                toast.parentNode.removeChild(toast);
                Toast.count--;
                if (Toast.count === 0) {
                    const __toastContainer = document.querySelector('#toast-container');
                    if (__toastContainer !== null && __toastContainer.parentNode !== null) {
                        __toastContainer.parentNode.removeChild(__toastContainer);
                    }
                }
            }
        }, 5000);
    }
}
