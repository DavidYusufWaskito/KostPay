import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function NumberInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);
    
    const getNumber = (_str) => {
        const arr = _str.split('');
        const out = arr.filter(c => !isNaN(c)).join('');
        return Number(out);
    };

    const updateTextView = (_obj) => {
        const num = getNumber(_obj.value);
        if (num === 0) {
            _obj.value = '';
        } else {
            _obj.value = num.toLocaleString();
        }
    };

    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={input}
            onKeyUp={e => updateTextView(e.target)}
        />
    );
});
