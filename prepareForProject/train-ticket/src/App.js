import React, { Component,PureComponent, createContext, lazy, Suspense,Fragment, memo, useState, useEffect, useContext, useMemo, useRef } from 'react';

const About = lazy(() => import ('./About'))

const BatteryContext = createContext(55)
const OnBool = createContext()

const ParentContext = createContext()

class Leaf extends Component{
  static contextType = OnBool
  render() {
    const bool = this.context
    console.log('...',bool)
    return (
      <div>
        {/* <OnBoolContext.Consumer>
                {a => <h1>B: ---- S:{String(a)}</h1>}
        </OnBoolContext.Consumer> */}
        
        {/* <BatteryContext.Consumer>
         
          {
            battery => (
              <OnBool.Consumer>
                {a => <h1>B:{battery} ---- S:{String(a)}</h1>}
              </OnBool.Consumer>
            )
            }
          
        </BatteryContext.Consumer> */}
        <div>
          lllll-----{String(bool)}
        </div>
      </div>
    )
  }
}


class Middle extends Component{
  render() {
    return (
      <div>middle
        <Leaf></Leaf>
      </div>
    )
  }
}


const A = memo( function A(props) {
  console.log('....A');
  return(<div>
    {props.A}
  </div>)
})
// class A extends PureComponent{
//   render() {
//     console.log('...A');
//     return (
//       <div>
//         {this.props.A}
//       </div>
//     )
//   }
// }

class B extends PureComponent{
  render() {
    console.log('...B');
    return (
      <div>
        {this.props.B}
      </div>
    )
  }
}

function UseEffectExample() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height:document.documentElement.clientHeight
  })
  useEffect(() => { 
    window.addEventListener('resize', (e) => {
      setSize({
        width: document.documentElement.clientWidth,
        height:document.documentElement.clientHeight
      })
    },false)

    return () => {
      window.removeEventListener('resize',(e) => {
        setSize({
          width: document.documentElement.clientWidth,
          height:document.documentElement.clientHeight
        })
      },false)
    }
  },[])
  
  return (
    <div>
      <span>面积 {size.width+'X'+size.height} </span>
    </div>
  )
}


function UseConTextExample() {
  
  const [count,setCount] = useState(0)
  return (
    <Fragment>
      <button onClick={()=>{setCount(count + 1)}}></button>
      <ParentContext.Provider value={count}>
        <UseConTextExampleReceive>

        </UseConTextExampleReceive>
      </ParentContext.Provider>
    </Fragment>
  )
}
function UseConTextExampleReceive() {
  const count = useContext(ParentContext)
  return (
    <div>
      {count}
    </div>
  )
}

function UseMemo() {
  const [count, setCount] = useState(0)
  const double = useMemo(() => {
    return count * 2
  }, [count === 3])
  
  const onClick = useMemo(() => {
    return () => {
      console.log('...fun render')
    }
  },[])
  return (
    <Fragment>
      <button onClick={() => { setCount(count + 1) }}>{count}---{double}</button>
      <UseMemoChild double={double} onClick = {onClick}></UseMemoChild>
      {/* <span>{count}---{double}</span> */}
    </Fragment>
  )
}

const UseMemoChild = memo(function UseMemoChild(props) {
  console.log('child render')
  return (
    <h1 onClick ={props.onClick}>{props.double}</h1>
  )
})

class Counter extends Component{
  render() {
    return (
      <h1>{this.props.count}</h1>
    )
  }
}

function useCount(defaultCount) {
  const [count, setCount] = useState(defaultCount)
  const it = useRef();

  useEffect(() => {
    it.current = setInterval(() => {
      setCount(count => count + 1)
    },1000)
  }, [])

  useEffect(() => {
    if (count >= 10) {
      clearInterval(it.current)
    }
  })
  return [count,setCount]
}

function UseSelfHookExample() {
  const [count,setCount] = useCount(0)
  
  return (
    <div>
      <button type='button' onClick={() => { setCount(count + 1) }}>
        Click({count})
      </button>
      <Counter count={count}></Counter>
    </div>
  )
}



class App extends Component{
  state = {
    value: 59,
    aaa: false,
    c: 1,
    d: 2
  }
  render() {
    let { value, aaa, c, d } = this.state
    console.log('parent',c,d);
    return (
      /**
       * suspense的使用
       */
      // <div>
      //   <Suspense fallback={<div>loading</div>}>
      //     <About></About>
      //   </Suspense>
      // </div>
      /**
       * memo的使用
       * 
       */
      // <Fragment>
      //   <button onClick={()=>{this.setState({c:c++})}} ></button>
      //   <A A={c}></A>
      //   <B B={d}></B>
      // </Fragment>

      /**
       * useEffect的使用
       */
      // <UseEffectExample></UseEffectExample>
      
      /**
       * useContext的使用
       */
      // <UseConTextExample></UseConTextExample>

      /**
       * useMemo的使用
       */
      // <UseMemo></UseMemo>

      /**
       * 自定义Hooks的使用
       */
      <UseSelfHookExample></UseSelfHookExample>

      // <div>
      //  <BatteryContext.Provider value={this.state.value}>
      //   <OnBool.Provider value = {aaa}>
      //     <button onClick={() => { this.setState({ value: value - 1 }) }}> -1</button>
      //     <button onClick={() => { this.setState({ aaa: !aaa }) }}> switch</button>
      //     <Middle></Middle>
      //     </OnBool.Provider>
        
      //  </BatteryContext.Provider>
      // </div>
    )
  }
}

export default App;
