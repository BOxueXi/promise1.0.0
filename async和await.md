### async 函数： 得到Promise，状态和结果的规则和then的一样
```
async function main(){
	// 1. 如果返回值是一个非Promise的任意值，这个函数的结果是： 成功的promise
	// return 111;
	// 2. 如果返回值是一个Promise，这个函数的结果是： 由返回的Pronise的状态和结果决定
	//reurn new Promise((resolve,reject)=>{
	//	resolve('ok');
	//	reject('err');	
	//})
	// 抛出异常 这个函数的结果是： 失败的promise,结果是抛出的结果
    // throw 'error'
	
}
let re = main();
console.log(re);
```
### await 表达式
1. await右侧的表达式一般是promise对象，但也可以是其他值；
2. 如果表达式是promise对象，await返回的是promise成功的值(失败的promise会报错)；
3. 如果表达式是其他值，直接将这个值作为await的返回值。
注意： 
1. await必须写在async函数中；async函数可以没有await;
2. 如果await的promise失败了，就会抛出异常，需要通过try..catch处理。
```
async function main(){
	let p = new Promise((resolve,reject)=>{
		resolve('ok')
		// reject('err')
	})
	// 右侧是promise
	let res = await p
	// 右侧是其他类型的数据
	let res = await 20;
	// 如果右侧promise是失败的状态
	try{
		let res = await p;
	}catch(e){
		console.log(e)
	}
}
main()
```