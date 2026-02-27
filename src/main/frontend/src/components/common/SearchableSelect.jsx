import {useState} from 'react';

export default function SearchableSelect({
                                             display,
                                             open=true,
                                             items = [],
                                             labelKey,
                                             valueKey,
                                             onSelect,
                                             onClose,
                                             onOpen,
                                             renderItem,
                                             placeholder = 'Search...'
                                         }) {
    const [query, setQuery] = useState('');
    const [value, setValue] = useState(null);

    const filtered = items.filter(item =>
        String(item[labelKey])
            .toLowerCase()
            .includes(query.toLowerCase())
    );
    if (!display) return null;
    return (
        <div className="relative">
            <input
                value={query || (value ? value[labelKey] : '')}
                placeholder={placeholder}
                autoFocus={open}
                onClick={() => {
                    if (value) {
                        setValue(null);
                        setQuery('');
                    }
                    onOpen?.();
                }}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                    setQuery('');
                    onClose?.();
                }}
                className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow w-full z-20">
                    {filtered.length === 0 && (
                        <div className="px-4 py-2 text-sm text-slate-400">
                            No results
                        </div>
                    )}

                    {filtered.map(item => (
                        <div
                            key={item[valueKey]}
                            onMouseDown={() => {
                                setValue(item);
                                onSelect(item);
                            }}
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>)}
        </div>
    );
}