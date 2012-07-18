(function($) {
	$.fn.sms24x7 = function(){
		var options = arguments[0];
		var hideLoading = arguments[1];
		var confirmMsg = arguments[2];
		if(!confirmMsg || confirm(confirmMsg)){
			if(!hideLoading){ hideLoading = false; }
			var success = options.success;
			delete options.success;
			return this.each(function(){
				var settings = {
					beforeSend: function() { if(!hideLoading){ $.mobile.showPageLoadingMsg();} },
					context: $(this),
					scriptCharset: "UTF-8",
					dataType: "jsonp",
					url: 'https://api.sms24x7.ru/?api_v=1.1&',
					data: "",
					success: function(data){
						var data_json = data.response.data;
						var msg = data.response.msg;
						if(msg.text != 'OK' || msg.err_code){
							if(msg.err_code){
								var msg_class = "e";
							}else{
								var msg_class = "a";
							}
							if(!hideLoading || msg.err_code){
								$.mobile.showPageLoadingMsg(msg_class, msg.text, true);
								window.setTimeout(function(){
									if(msg.err_code == 3 || msg.err_code == 42){
										window.location.href = "login.html";
									}
									$.mobile.hidePageLoadingMsg();
								}, 2000);
							}
						}else if(!hideLoading){
							$.mobile.hidePageLoadingMsg();
						}
						if(!msg.err_code){
							if($.isFunction(success)){ success(data_json, data.response.total_data_elements); }
						}
					},
					error: function(){
						alert('Нет подключения к интернет!');
					}
				}
				if ( options ) {
					$.extend( settings, options );
				}
				settings.data += "&format=jsonp";
				$.ajax( settings );
			});
		}
	};
})(jQuery);
