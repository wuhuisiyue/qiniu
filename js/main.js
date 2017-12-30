/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */

$(function() {
    var uploader = Qiniu.uploader({
        disable_statistics_report: true,
        makeLogFunc: 1,
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '10000mb',//上传文件的最大值
        dragdrop: false,
        chunk_size: '4mb',
        multi_selection: !(moxie.core.utils.Env.OS.toLowerCase()==="ios"),
				// uptoken_url : 'uptoken_url',  //在这里我自己以data目录下uptoken.php为例
				// uptoken:'XXXXX',   //uptoken_url和uptoken任选其一，注意：uptoken_url返回的是一个json字符串，否则出错
        unique_names: true,
        max_retries: 7,                     // 上传失败最大重试次数
        // uptoken_func: function(){
        //     var ajax = new XMLHttpRequest();
        //     ajax.open('GET', $('#uptoken_url').val(), false);
        //     ajax.setRequestHeader("If-Modified-Since", "0");
        //     ajax.send();
        //     if (ajax.status === 200) {
        //         var res = JSON.parse(ajax.responseText);
        //         console.log('custom uptoken_func:' + res.uptoken);
        //         return res.uptoken;
        //     } else {
        //         console.log('custom uptoken_func err');
        //         return '';
        //     }
        // },
        // domain: 'domain',   //必填   你自己的七牛空间域名
        get_new_uptoken: false,
        auto_start: false,
        log_level: 5,
        init: {
					//选择图片文件前操作函数
					'BeforeChunkUpload':function (up,file) {
						console.log("before chunk upload:",file.name);
					},
					//选择图片后操作函数
					'FilesAdded': function(up, files) {
						plupload.each(files, function(file) {
							//判断文件的类型
							if(file.type=='image/jpeg'||file.type=='image/jpg'||file.type=='image/png'||file.type=='image/gif' || file.type=='video/x-matroska' || file.type=='video/mp4'){
								console.log('type:' + file.type);
								// console.log(file);
								isUpload =true;
							}else {
								// 不是图片不能上传
								isUpload = false;
								up.removeFile(file);
								alert('上传类型只能是.jpg,.png,.gif,.mkv');
								return false;
							}
						});
					},
					'BeforeUpload': function(up, file) {
						// console.log("this is a beforeupload function from init");
						// console.log(file);
						// var progress = new FileProgress(file, 'fsUploadProgress');
						// var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						// if (up.runtime === 'html5' && chunk_size) {
						//     progress.setChunkProgess(chunk_size);
						// }
					},
					'UploadProgress': function(up, file) {
						// console.log(file);
						// var progress = new FileProgress(file, 'fsUploadProgress');
						// var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
						// progress.setProgress(file.percent + "%", file.speed, chunk_size);
					},
					'UploadComplete': function() {
						// $('#success').show();
					},
					// 图片上传成功之后操作函数
					'FileUploaded': function(up, file, info) {
						// 每个文件上传成功后，处理相关的事情
						// 其中info.response是文件上传成功后，服务端返回的json，形式如：
						// {
						//    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
						//    "key": "gogopher.jpg"
						//  }
						// 查看简单反馈
						var domain = up.getOption('domain');
						var res = JSON.parse(info.response);
						var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url
						console.log(sourceLink);
						$("#loadimg").attr("src",sourceLink);
					},
					// 上传失败操作函数
					'Error': function(up, err, errTip) {
						console.log(file);
						// var progress = new FileProgress(err.file, 'fsUploadProgress');
						// progress.setError();
						// progress.setStatus(errTip);
						alert("上传失败，请检查网络问题！")
					}
        }
    });
    uploader.bind('FilesAdded', function() {
			// console.log("hello man, a file added");
    });
    uploader.bind('BeforeUpload', function () {
			// console.log("hello man, i am going to upload a file");
    });
    uploader.bind('FileUploaded', function () {
			// console.log('hello man,a file is uploaded');
    });

    //取消选择文件后自动上传后自定义的上传函数
    $('#up_load').on('click', function(){
			uploader.start();
    });
    //停止上传
        // $('#stop_load').on('click', function(){
        //     uploader.stop();
        // });
    // 重试
        // $('#retry').on('click', function(){
        //     uploader.stop();
        //     uploader.start();
    // });
    //拖拽上传事件
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
			e.preventDefault();
			$('#container').removeClass('draging');
			e.stopPropagation();
    }).on('dragleave', function(e) {
			e.preventDefault();
			$('#container').removeClass('draging');
			e.stopPropagation();
    }).on('dragover', function(e) {
			e.preventDefault();
			$('#container').addClass('draging');
			e.stopPropagation();
    });
});
