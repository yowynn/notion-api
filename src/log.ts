
function stringify(...args: any[]) {
    const new_args = args.map((item) => {
        switch (typeof item) {
            case 'object':
                return JSON.stringify(item, null, 4);
            default:
                return item;
        }
    });
    return new_args.join(' ');
}

export function info(...args: any[]) {
    console.log(stringify(...args));
}
