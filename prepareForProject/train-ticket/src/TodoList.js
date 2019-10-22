import React, { Component, PureComponent, createContext, lazy, Suspense, Fragment, memo, useState, useEffect, useContext, useMemo, useRef, useCallback } from 'react';
import './TodoList.css'
import * as actions from './actionCreators'


let idSeq = Date.now()
const LS_key = '_$get_'

function bindActionCreators(actions, dispatch) {
    const ret = {}
    for (let key in actions) {
        ret[key] = function (...args) {
            const eachAction = actions[key]
            dispatch(eachAction(...args))
        }
    }
    return ret
}

/**
 * 
 * @param {*} reducers 
 * 与reducer对象中更新相对应的至，最后返回原来的值merge新的值
 */
function combineReducers(reducers) {
    return function reducer(state, action) {
        const changed = {}
        for (let key in reducers) {
            changed[key] = reducers[key](state[key],action)
        }
        return {
            ...state,
            ...changed
        }
    }
}

function Control(props) {
    // const { dispatch } = props
    const { addTodo } = props
    const inputRef = useRef()
    const onSubmit = (e) => {
        e.preventDefault()

        const newText = inputRef.current.value.trim()
        if (newText.length === 0) {
            return;
        }

        addTodo({
            id: ++idSeq,
            text: newText,
            complete: false
        })

        // actions.addToDo({
        //     id: ++idSeq,
        //     text: newText,
        //     complete: false
        // })

        // dispatch(actions.createAdd({
        //     id: ++idSeq,
        //     text: newText,
        //     complete: false
        // }))
        // dispatch({
        //     type:'add',
        //     payload: {
        //         id: ++idSeq,
        //         text: newText,
        //         complete: false
        //     }
        // })
        inputRef.current.value = '';
    }

    return (
        <div className='control'>
            <h1>todos</h1>
            <form onSubmit={onSubmit}>
                <input
                    className='new-todo'
                    ref={inputRef}
                    type="text"
                    placeholder='What needs to be done'
                />
            </form>
        </div>
    );
}

function TodoItem(props) {
    const {
        todo: {
            id,
            text,
            complete
        },
        removeTodo,
        toggleTodo
    } = props
    console.log('...props',props)
    
    
    const handleChange = () => {
        toggleTodo(id)
        
        // dispatch(actions.createToggle(id))
        // dispatch({
        //     type: 'toggle',
        //     payload:id
        // })
        // toggleTodo(id)
    }

    const handleClick = () => {
        removeTodo(id)
        // dispatch(actions.createRemove(id))
        // dispatch({
        //     type: 'remove',
        //     payload:id
        // })
        // removeTodo(id)
    }
    return (
        <li className='todo-item'>
        <input
            type='checkbox'
            onChange={handleChange}
            checked={complete}
            ></input>
            <label className={complete ? 'complete' : ''}>{text}</label>
            <button onClick={handleClick}>&#xd7;</button>
    </li>
    )
}

function Todos(props) {
    const {removeTodo,toggleTodo,todos} = props
    return (
        <div>
            <ul className='todo_list'>
                {
                    todos.map(item => (
                        // <TodoItem todo={item} removeTodo={removeTodo} toggleTodo={toggleTodo}>
                        // <TodoItem todo={item} dispatch={dispatch} key={item.id}>
                        <TodoItem todo={item} removeTodo={removeTodo} toggleTodo={toggleTodo}  key={item.id}>
                            {item.text}
                        </TodoItem>
                    ))
                }
            </ul>
        </div>
    )
}

function TodoList() {
    const [todos, setTodos] = useState([])
    const [incrementCount,setIncrementCount] = useState(0) 
    
    const addTodo = useCallback((todo) => {
        setTodos(todos => [...todos, todo])
        dispatch({
            type: 'add',
            payload:todo
        })
    },[])
    const removeTodo = useCallback((id) => {
        setTodos(todos => todos.filter(todo => {
            return todo.id !== id
        }))
    },[])

    const toggleTodo = useCallback((id) => {
        setTodos(todos => todos.map(todo => {
            return todo.id === id
                ? {
                    ...todo,
                    complete: !todo.complete
                }
                : todo;
        }))
    }, [])

    const reducers = {
        todos(state, action) {
        const { type, payload } = action
        // const { todos ,incrementCount} = state
        switch (type) {
            case 'set':
                return payload
            case 'add':
                return [...state, payload]
                
            case 'remove':
                return state.filter(todo => {
                            return todo.id !== action.payload
                        })
    
            case 'toggle':
                return state.map(todo => {
                        return todo.id === action.payload
                            ? {
                                ...todo,
                                complete: !todo.complete
                            }
                            : todo;
                })
                    
            default:
                console.log('111');
        }
        return state;
        },
        incrementCount(state, action) {
            const { type} = action
            switch (type) {
                case 'set':
                    return state + 1
                case 'add':
                    return state + 1
                default:
                    console.log('111');
            }
            return state
        }
    }
    // function reducer(state, action) {
    //     const { type, payload } = action
    //     const { todos ,incrementCount} = state
    //     switch (type) {
    //         case 'set':
    //             return {
    //                 ...state,
    //                 todos: payload,
    //                 incrementCount: incrementCount + 1
    //             }
    //         case 'add':
    //             return {
    //                 ...state,
    //                 todos: [...todos, payload],
    //                 incrementCount: incrementCount + 1
    //             }
    //         case 'remove':
    //                 return {
    //                     ...state,
    //                     todos:todos.filter(todo => {
    //                         return todo.id !== action.payload
    //                     })
    //                 }
    //         case 'toggle':
    //                 return {
    //                     ...state,
    //                     todos:todos.map(todo => {
    //                         return todo.id === action.payload
    //                             ? {
    //                                 ...todo,
    //                                 complete: !todo.complete
    //                             }
    //                             : todo;
    //                     })
    //                 }
    //         default:
    //             console.log('111');
    //     }
    //     return state;
    // }

    const reducer = combineReducers(reducers)

    const dispatch = useCallback((action) => {
        const state = {
            todos,
            incrementCount
        }
        const setters = {
            todos: setTodos,
            incrementCount:setIncrementCount
        }

        const newState = reducer(state, action)
        
        for (let key in newState) {
            setters[key](newState[key])
        }

        // const { type, payload } = action
        // switch (type) {
        //     case 'add':
        //         setTodos(todos => [...todos,payload])
        //         break;
        //     case 'set':
        //         setTodos(payload)
        //         break;
        //     case 'remove':
        //         setTodos(todos => todos.filter(todo => {
        //             return todo.id !== action.payload
        //         }))
        //         break;
        //     case 'toggle':
        //         setTodos(todos => todos.map(todo => {
        //             return todo.id === action.payload
        //                 ? {
        //                     ...todo,
        //                     complete: !todo.complete
        //                 }
        //                 : todo;
        //         }))
        //         break;
        //     default:
        //         console.log('111')
        // }
    },[todos,incrementCount])

    useEffect(() => {
        const todos = JSON.parse(localStorage.getItem(LS_key || '[]'))
        dispatch(actions.createSet(todos))
        // dispatch({
        //     type: 'set',
        //     payload:todos
        // })
        // setTodos(todos)
    },[])

    useEffect(() => {
        localStorage.setItem(LS_key, JSON.stringify(todos))
    },[todos])

    return (
        <div className='todo-list'>
            {/* <Control addTodo={addTodo}></Control> */}
            {/* <Control dispatch={dispatch}></Control> */}
            <Control {
                ...bindActionCreators({
                    addTodo:actions.createAdd
                },dispatch)
            }></Control>
            {/* <Todos todos={todos} removeTodo={removeTodo} toggleTodo={toggleTodo}></Todos> */}
            {/* <Todos todos={todos} dispatch={dispatch}></Todos> */}
            <Todos todos={todos} {...bindActionCreators({
                removeTodo: actions.createRemove,
                toggleTodo: actions.createToggle
            },dispatch)}></Todos>
        </div>
    )
}

export default TodoList;