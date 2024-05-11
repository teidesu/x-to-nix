import { Show, createSignal, mergeProps } from 'solid-js'
import { useFloating } from 'solid-floating-ui'
import { autoUpdate, flip, offset, size } from '@floating-ui/dom'
import clsx from 'clsx'
import { Transition } from 'solid-transition-group'

import { Icon } from '../Icons/Icon'
import { GrChevronDown } from '../Icons/glyphs/GrChevronDown'

import css from './Select.module.css'

export interface OptionData {
    display: string
    value: string
}

export interface SelectProps {
    class?: string
    onChange: (value: string) => void
    options: OptionData[]
    default: string
    blankSearch?: boolean
    outline?: boolean
}

export function Select(props: SelectProps) {
    const merged = mergeProps({ blankSearch: false }, props)

    let queryTimeout: NodeJS.Timeout | undefined
    const [open, setOpen] = createSignal(false)
    const [query, setQuery] = createSignal('')
    const [selected, setSelected] = createSignal(merged.default)
    const [next, setNext] = createSignal(merged.default)

    const [selectContainerRef, setSelectContainerRef] = createSignal<HTMLDivElement>()
    const [optionContainerRef, setOptionContainerRef] = createSignal<HTMLDivElement>()

    const position = useFloating(selectContainerRef, optionContainerRef, {
        placement: 'bottom',
        middleware: [
            flip({
                fallbackPlacements: ['top'],
            }),
            offset(4),
            size({
                apply({ rects, elements }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    })
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    })

    const setMenuState = (state: boolean) => {
        setOpen(state)

        if (!state) {
            setNext(selected())
        }
    }

    const updateQuery = (newValue: string): boolean => {
        if (newValue[0] === ' ' && !merged.blankSearch) return false

        clearTimeout(queryTimeout)
        setQuery(newValue)
        queryTimeout = setTimeout(() => setQuery(''), 1000)

        return true
    }

    const handleArrowPress = (newIdxFn: (old: number) => number) => {
        const currentValue = open() ? next() : selected()
        const idx = props.options.findIndex(e => e.value === currentValue) ?? ''
        const newIdx = newIdxFn(idx)

        const nextValue = props.options[newIdx].value

        if (open()) {
            setNext(nextValue)
        } else {
            merged.onChange(setSelected(nextValue))
        }
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (open()) {
            if ([...e.key].length === 1 && !e.ctrlKey && !e.metaKey) {
                const updateSuccessful = updateQuery(query() + e.key)

                if (updateSuccessful) {
                    const pred = (e: OptionData) => e.display.startsWith(query())
                    const option = props.options.find(pred)

                    if (option !== undefined) {
                        setNext(option.value)
                    }
                }
            }
        }

        switch (e.key) {
            case ' ':
                if (!open()) {
                    setMenuState(true)
                }
                break

            case 'Enter':
                merged.onChange(setSelected(next()))
                setMenuState(false)
                break

            case 'Escape':
                setMenuState(false)
                break

            case 'Backspace':
                updateQuery(query().slice(0, -1))
                break

            case 'ArrowUp': {
                const fn = (idx: number) => idx - 1 >= 0
                    ? (idx - 1) % props.options.length
                    : props.options.length - 1

                handleArrowPress(fn)
                e.preventDefault()
                break
            }

            case 'ArrowDown': {
                const fn = (idx: number) => (idx + 1) % props.options.length

                handleArrowPress(fn)
                e.preventDefault()
                break
            }
        }
    }

    return (
        <div
            ref={setSelectContainerRef}
            tabindex="0"
            class={clsx(
                css.select,
                open() && css.open,
                merged.outline && css.outline,
                props.class,
            )}
            onBlur={() => setMenuState(false)}
            onMouseDown={(event) => {
                // ignore if within props.options
                if (optionContainerRef()?.contains(event.target)) return
                setMenuState(!open())
            }}
            onKeyDown={onKeyDown}
        >
            <div class={css.value}>
                {props.options.find(e => e.value === selected())?.display ?? ''}
            </div>
            <Icon
                class={css.icon}
                glyph={GrChevronDown}
                size={16}
            />
            <Show when={query().length > 0}>
                <div class={css.query}>
                    {query()}
                </div>
            </Show>
            <Transition name="slide-down-up">
                <Show when={open()}>
                    <div
                        ref={setOptionContainerRef}
                        class={css.options}
                        style={{
                            position: position.strategy,
                            top: `${position.y ?? 0}px`,
                            left: `${position.x ?? 0}px`,
                        }}
                    >
                        {props.options.map(option => (
                            <div
                                classList={{
                                    [css.selected]: option.value === next(),
                                    [css.option]: true,
                                }}
                                onMouseEnter={() => {
                                    setNext(option.value)
                                }}
                                onMouseUp={() => {
                                    setSelected(option.value)
                                    merged.onChange(option.value)
                                    setMenuState(false)
                                }}
                            >
                                {option.display}
                            </div>
                        ))}
                    </div>
                </Show>
            </Transition>
        </div>
    )
}
