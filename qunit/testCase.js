module('Module Assert'); 
test('ok', function() { 
	function isEven(val) { 
		return val % 2 === 0; 
	}

    ok(isEven(0), 'Zero is an even number'); 
    ok(isEven(2), 'So is two'); 
    ok(isEven(-4), 'So is negative four'); 
    ok(!isEven(1), 'One is not an even number'); 
    ok(!isEven(-7), 'Neither is negative seven'); 
	ok(isEven(3), 'Neither is negative seven'); //测试：3是偶数（故意出错）
	
	 ok(1 == "1", "Passed!");
});

test('equal', function() { 
	equal( 1, 1, 'one equals one');
	equal( {}, {}, 'fails, Expected'); //不能用来处理对象
	equal( {a: 1}, {a: 1} , 'fails, Expected');  //不能用来处理对象
	
	strictEqual( [1], [1], 'passes'); //提示预期值，严格比较
	strictEqual( {a: 1},{a: 1}, 'passes'); 
	
	propEqual([1], [1], 'passes') ;//不提示预期值
});

test('deepEqual', function() { 
	deepEqual( {}, {}, 'passes, these are same objects');
	deepEqual( {a: 1}, {a: 1} , 'passes'); 
	deepEqual( [1], [1], 'passes'); 
	deepEqual({a:1},{a:2},'fails, is different Object');
	
	strictEqual( [1], [1], 'passes'); //提示预期值，严格比较
	strictEqual( {a: 1},{a: 1}, 'passes'); 
	
	propEqual([1], [1], 'passes') ;//不提示预期值
});

test('strictEqual', function() { 
	strictEqual( [1], [1], 'fails'); //不是同一个对象，不通过
	strictEqual( [1], [2], 'fails');
	strictEqual( {a: 1},{a: 1}, 'fails'); 
	strictEqual( {a: 1},{a: 2}, 'fails'); 
	
	var testObj = {a:1};
	strictEqual( testObj,testObj, 'passes'); //同一个对象通过
});

test('propEqual', function() {
	propEqual([1], [1], 'passes') ;//比较对象的属性值
	propEqual([1], [2], 'fails') ;
	notPropEqual([1], [1], 'fails') ;
	notPropEqual([1], [2], 'passes') ;
});

//测试是否抛出了异常
test("throws", function () 
{
    function CustomError(message)
    {
        this.message = message;
    }
    CustomError.prototype.toString = function ()
    {
        return this.message;
    };
    throws(function ()
    {
        throw "error"
    }, "throws with just a message, not using the 'expected' argument");
    throws(function ()
    {
        throw new CustomError();
    }, CustomError, "raised error is an instance of CustomError");
    throws(function ()
    {
        throw new CustomError("some error description");
    }, /description/, "raised error message contains 'description'");//异常信息能够用正则表达式description来匹配
}
);

module('Module Async');

test("stop&start", function ()
{
	stop();
	
	var asyncOp = {result:0};
	setTimeout(function(){asyncOp.result = 'someExpectedValue'},100);//100ms后赋值，测试结果会是okay
	//setTimeout(function(){asyncOp.result = 'someExpectedValue'},200);//200ms后赋值，测试结果会是failed
	
    setTimeout(function ()
    {
        equal(asyncOp.result, "someExpectedValue");
        start();
    }, 150);
}
);


asyncTest("one second later!", function ()
{
	//expect(1);
    expect(1);
    setTimeout(function ()
    {
        ok(true, "Passed and ready to resume!");
        start();
    }, 1000);
}
);


//expect:有多少个断言在一次测试中。
test("expect", function ()
{
    expect(2);
    function calc(x, operation)
    {
        return operation(x);
    }
    var result = calc(2, function (x)
        {
            ok(true, "calc() calls operation function");
            return x * x;
        }
        );
    equal(result, 4, "2 squared equals 4");
}
);


//这个例子会一直等待事件触发后才继续断言，所以会一直阻塞
asyncTest("asynchronous test: video ready to play", function ()
{
    expect(1);
    var $video = $("video");
    $video.on("canplaythrough", function ()
    {
        ok(true, "video has loaded and is ready to play");
        start();
    }
    );
}
);





