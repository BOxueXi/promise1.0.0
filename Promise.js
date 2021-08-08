function Promise(excutor) {
	let _this = this;
	_this.PromiseState = 'pending';
	_this.PromiseResult = null;
	_this.callbackArr = []; //保存回调
	function callback(type) {
		try {
			//获取回调函数的执行结果
			let result = type(_this.PromiseResult);
			if (result instanceof Promise) {
				//如果是Promise
				result.then((res) => {
					resolve(res);
				}, (rej) => {
					reject(rej)
				})
			} else {
				//将结果的状态改为成功
				resolve(result);
			}
		} catch (e) {
			reject(e)
		}
	}
	//resolve函数
	function resolve(data) {
		if (_this.PromiseState !== 'pending') return; //状态只能改变一次
		// 1.修改对象的状态 (PromiseState)
		_this.PromiseState = 'fulfilled';
		// 2.设置对象的结果值(PromiseResult)
		_this.PromiseResult = data;
		//调用成功的回调函数
		setTimeout(()=>{
			_this.callbackArr.forEach((item) => {
				item.onResolved(data);
			})
		})
	}
	//reject函数
	function reject(data) {
		if (_this.PromiseState !== 'pending') return; //状态只能改变一次
		// 1.修改对象的状态 (PromiseState)
		_this.PromiseState = 'rejected';
		// 2.设置对象的结果值(PromiseResult)
		_this.PromiseResult = data;
		//调用失败的回调函数
		setTimeout(()=>{
			_this.callbackArr.forEach((item) => {
				item.onRejected(data);
			})
		})
	}
	try {
		// 同步调用
		excutor(resolve, reject);
	} catch (e) {
		//修改promise状态为失败
		reject(e)
	}
}
Promise.prototype.then = function(onResolved, onRejected) {
	let _this = this;
	if(typeof onRejected !== 'function'){
		//异常穿透
		onRejected = (e) => {
			throw e;
		}
	}
	if(typeof onResolved !== 'function'){
		onResolved = (value) => {
			return value;
		}
	}
	return new Promise((resolve, reject) => {
		if (this.PromiseState === 'fulfilled') {
			setTimeout(()=>{
				callback(onResolved);
			})
		}
		if (this.PromiseState === 'rejected') {
			setTimeout(()=>{
				callback(onRejected);
			})
		}
		if (this.PromiseState === 'pending') {
			this.callbackArr.push({
				onResolved: function() {
					callback(onResolved);
				},
				onRejected: function() {
					callback(onRejected);

				}
			})
		}
	})
}

Promise.prototype.cacth = function(onRejected){
	return this.then(undefined,onRejected);
}

Promise.resolve = function(value){
	return new Promise((resolve,reject)=>{
		if(vale instanceof Promise){
			value.then(res=>{
				resolve(res);
			},rej=>{
				reject(rej);
			})
		}else{
			//状态改为成功
			resolve(value)
		}
	})
}
Promise.reject = function(error){
	return new Promise((resolve,reject)=>{
		reject(error);
	})
}

Promise.all = function(promises){
	return new Promise((resolve,reject)=>{
		let count = 0; //成功的个数
		let len = promises.length;
		let arr = []; //成功的结果
		//遍历
		for(let i=0;i<len;i++){
			promises[i].then(res=>{
				//当前的对象是成功的
				count++; 
				arr[i] = res;
				if(count === len){
					resolve(arr[i]);
				}
			},rej=>{
				reject(rej);
			})
		}
	})
}

Promise.race = function(promises){
	return new Promise((resolve,reject)=>{
		for(let i=0;i<promises.length;i++){
			//直接改变状态，改变之后不能在改变了，得到的是第一个完成的promise的状态和结果(赛跑)
			promises[i].then(res=>{
				resolve(res);
			},rej=>{
				reject(rej)
			})
		}
	})
}