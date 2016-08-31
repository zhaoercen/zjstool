工具使用：
  1、通过启动服务器（执行server.exe）来使用工具。在打开的页面中，选择超连接“target/pages/index.html”

目录说明：
  node_modules目录和gulpfile.js：
    gulp基于nodejs，node_modules是运行gulp所需用到的js库。
    运行gulpfile.js的任务，对代码合并替换和输出到target或chromeExtenstion目录。
    gulp说明：
      1、default任务会执行watch任务对src下的文件进行监控。watch任务启动后，src下的文件变化之后就会自动触发srcPublish任务。
      2、可以手工运行任务编译或处理src下改动后的文件。
      3、node_modules、gulpfile.js都是gulp使用的，运行时用不到。
  src目录：
    源文件，只用修改此目录下的文件。src下是gulp处理前的文件，需要gulp处理后才能使用。
  target目录：
    gulp的输出目录，运行根目录下的server.exe就会启动一个小型web服务器。然后从页面进入target/index.html查看本工具效果。
  qunit目录：
    测试js用
  chromeExtenstion目录：
    用于google浏览器扩展，目录下的内容打包成zip后上传到google浏览器应用商店。
    需要有描述文件manifest.json
    部分页面需要做对应的修改。