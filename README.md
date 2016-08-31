#####工具目的
1、简化编程过程中常见的字符转换工作。<br/>
2、已实现转换功能：大写，小写，驼峰，反驼峰



#####工具使用
1、通过启动服务器（执行server.exe）来使用工具。在打开的页面中，选择超连接“target/pages/index.html”<br/>

#####目录说明
* node_modules目录和gulpfile.js：<br/>
node_modules、gulpfile.js都是gulp使用的，运行时用不到。运行gulpfile.js的任务，对代码合并替换和输出到target或chromeExtenstion目录。<br/>
* src目录：<br/>
源文件，只用修改此目录下的文件。src下是gulp处理前的文件，需要gulp处理后才能使用。<br/>
* target目录：<br/>
gulp的输出目录，运行根目录下的server.exe就会启动一个小型web服务器。然后从页面进入target/index.html查看本工具效果。<br/>
* qunit目录：<br/>
测试js用<br/>
* chromeExtenstion目录：<br/>
用于chrome浏览器扩展，目录下的内容打包成zip后上传到chrome应用商店。<br/>
（chrome应用商店搜索"文本替换工具"使用）
