### Promise是什么：回调函数是异步执行的
1. 抽象表达:
   1. Promise是一门新的技术（es6规范）；
   2. Promise是js中进行异步编程的新解决方案（旧的方案是单纯使用回调函数）。
2. 具体表达： 
   1. 从语法上来说：Promise是一个构造函数；
   2. 从功能上来说： Promise对象用来封装一个异步操作并可以获取其成功或失败的结果值。

### 支持链式调用，可以解决回调地狱问题
1. 什么事回调地狱？
	回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调执行的条件
2. 回调地狱的缺点？
	不便阅读，不便于异步处理。

### Promise的状态改变([[PromiseState]])
实例对象中的一个属性 [[PromiseState]]
* pending 未决定的
* resolved 或 fullfilled 成功
* rejected 失败


状态改变只能如下：
1. pending变为resolved;
2. pending变为rejected;
说明： 一个promise对象只能改变一次，无论为成功还是失败，都会有一个结果数据

### Promise 对象的值
实例对象中的另一个属性 [[PromiseResult]] ,保存着异步任务【成功/失败】的结果
* resolve
* reject

### Promise构造函数：Promise(excutor){}
```
new Promise((resolve,reject)=>{})
1. excutor函数：执行器 (resolve,reject)=>{}(立即同步调用);
2. resolve函数： 内部定义成功时调用的函数 value => {};
3. reject函数： 内部定义失败时调用的函数  err => {};
说明：executor会在Promise内部立即同步调用，异步操作在执行器中执行
(即参数是一个函数，会立即同步调用，异步操作放在这个函数里面执行)
let p = new Promise((resolve,reject)=>{
	console.log(111)
})
console.log(222)
打印出 111,222
```


### Promise.prototype.then方法：（onResolved,onRejected）
```
注意： 只有当promise的状态改变才会执行回调函数里面的代码
.then((value) => {},(value) => {})
1. onResolved函数：成功的回调函数 (value) => {};
2. onRejected函数：失败的回调函数 (value) => {};
说明： 第一个参数是成功的回调函数，第二个参数是失败的回调函数，返回一个新的Promise对象。

返回一个新的Promise对象 ，状态根据情况而定， 结果是回调函数返回的结果
* 回调函数如果返回 非Promise的任意值,则得到一个成功的Promise对象，状态是成功的
* 回调函数如果返回的是Promise，则状态是由 返回的Promise的状态决定的，
* throw 'errr' , 使用throw 抛出异常，则得到的状态是失败的
```

### Promise.prototype.catch方法： (onReject)
```
注意： 只有当promise的状态改变才会执行回调函数里面的代码
.catch((err)=>{
	
})
onReject: 失败的回调
```

### Promise.resolve方法： （value）=> {}
```
返回一个成功或者失败的promise
let p = Promise.resolve(111) 是成功的Promise对象
1. 如果参数为非Promise类型的的任意值，则返回的结果都是成功的Promise对象；
2. 如果参数为Promise对象，则返回的结果是由 参数Promise对象的结果决定
let p = Promise.resolve(new Promise((resolve,reject)=>{
	
})) 由 参数Promise对象的结果决定
```

### Promise.reject方法： （err）=> {}
```
返回失败的promise的对象
```
### Promise.all方法： （promise）=> {}
```
参数是一个包含n个promise的数组
返回一个新的promise，只有所有的promise都成功了，状态才是成功的，结果是每一个promise的结果组成的数组
其中只要有一个是失败的，那状态就是失败的，结果是这个失败promise的结果
let p1 = new Promise((resolve,reject)=>{
	resolve('ok')
})
let p2 = Promise.resolve('success');
let p3 = Promise.resolve('Oh');
const result = Promise.all([p1,p2,p3])
console.log(result) // 得到的是状态成功的promise， 结果是包含这三个promise的结果的数组
```
### Promise.race方法： （promise）=> {}
```
参数是一个包含n个promise的数组
返回一个新的promise，第一个完成的promise的状态和结果就是得到的状态和结果
```

### 如何改变promise的状态
1. 调用resolve回调函数，pending -> fulfilled(resolve)；
2. reject回调函数,pending -> rejected;
3. 抛出错误，throw 'errrr',pending -> rejected;

### 一个promise指定多个成功或失败的回调函数，都会调用吗？
	当promise改为对应的状态时都会调用
```
	let p =  new Promise((resolve,reject)=>{
		resolve('ok');
	})
	//回调1
	p.then((vale)=>{
		console.log(value)
	})
	//回调2
	p.then((value)=>{
		console.log(value)
	})
	// 当p 的状态改变了，都会执行，如果p的状态还是在pending时，回调不会执行
```

### 改变promise状态和回调函数谁先执行
```
// 先改变状态，在调回调
let p = new Promise((resolve,reject)=>{
	//状态是同步的
	resolve('ok');
	// reject('err');
})
//.then()方法后执行
p.then((value)=>{
	console.log(value)
}.(err)=>{
	
})

// 先指定回调，在改状态
let p = new Promise((resolve,reject)=>{
	//状态是异步改变的
	setTimeout(()=>{
		resolve('ok');
		// reject('err');
	},1000)
})
// .then()返回先执行，里面的回调函数等到状态改变才执行（参数函数）
p.then((value)=>{
	console.log(value)
}.(err)=>{
	
})
```

### .then()返回的新的promise的结果状态由什么决定？（.then()返回还是一个promisem链式调用）
1. 由then(function(){})指定的回调函数执行的结果决定（参数函数,不管是成功的回调，还是失败的回调）
即 参数函数的结果：
1. 抛出异常，新promise为失败(rejected),结果([[PromiseResult]])为抛出的异常；
2. 返回的是非promise的任意值，新promise为成功(resolve),结果([[PromiseResult]])为返回的值；
3. 另一个新的promise，此promise的结果就会成为promise的结果。
```
.then(()=>{
	.then()返回的新的promise的结果状态由什么决定
	回调函数执行的结果决定
	1. 抛出异常
	throw '异常'
	得到的promise的状态就是reject，结果就是抛出的异常结果
	
	2. 返回非Promise
	return '111'
	得到的promise的状态就是成功,结果就是返回的结果
	
    3. 返回一个promise，
	return new Promise((resole,reject)=>{
		
	})
	得到的promise的状态由返回的promise的状态决定，结果是返回的promise的结果
})
```

### 异常穿透
```
1. 当使用promise的then链式调用时，可以在最后指定失败的回调；
2. 前面任何操作出了异常，都会传到最后失败的回调中处理

let p =  new Promise((resolve,reject)=>{
		resolve('ok');
	})
	p.then((vale)=>{
		console.log(value)
	}).then((value)=>{
		console.log(value)
	}).catch((err)=>{
		console.log(err)
	})
```

### 中断链式调用
```
//return new Promise(()=>{});返回pending的promise
let p =  new Promise((resolve,reject)=>{
		resolve('ok');
	})
	p.then((vale)=>{
		console.log(value)
		return new Promise(()=>{});
	}).then((value)=>{
		console.log(value)
	}).catch((err)=>{
		console.log(err)
	})
```