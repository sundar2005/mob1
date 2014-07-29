/* ------ Global variables ------ */

/* ------ Development ------ */
/*
console.log('------ Development Environment ------ ');
var strUsername = "xvsa6";
var strPassword = "tcssp20";
var uriPrefix='http://10.23.212.111:8000/';
var directUriPrefix='http://clsapd320.woolworths.com.au:8011/sap/opu/odata/sap/';
*/

/* ------ Testing ------ */

console.log('------ Testing Environment ------ ');
var strUsername = "mobileportal";
var strPassword = "google2013";
var directUriPrefix='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/';
var uriPrefix='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/';

/* ------ Production ------ */
/*
var strUsername = localStorage['strUsername'];
var strPassword = localStorage['strPassword'];
var directUriPrefix='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/';
var uriPrefix=directUriPrefix;//'http://ncdwsapsup0202:8000/';
*/

var site=localStorage['site'];
var oHeaders = {};
oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
oHeaders['Accept'] = "application/json";
var orderToggle="down";
var salesToggle="down";
var orderToggle="down";
var salesToggle="down";
var priceToggle="down";
var basicToggle="down";
var vendorToggle="down";
var generalToggle="down";
var articleToggle="down";

/* ------ Global variables ------ */

$(document).ready(function(){
	jQuery.support.cors = true;
	localStorage['allowAddItem']= false;
	 
	/* ------ View Order Details On Click Outside Header starts  ------ */
	
	$('#viewOrderDetails #billing-form, #viewOrderDetails #listItem ,#viewOrderDetails .add-item, #viewOrderDetails .save-exit ').one('click',function (){
		console.log("localStorage['orderDetails-firstClick'] : ", localStorage['orderDetails-firstClick']);    
		if(localStorage['orderDetails-firstClick']=='true'){
			$(".save-exit").removeAttr("onclick");
			$('#cancel-order-status .head-title').text('Order Details');
			$('#cancel-order-status #popup-msg').text('Please select an action to continue');
		    $('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut(); localStorage['orderDetails-firstClick']='false';");
		    localStorage['orderDetails-firstClick']='false';
		    $('.overlay, #cancel-order-status').fadeIn();
		    centerAlign('#cancel-order-status');
		}
	});
	/* ------ View Order Details On Click Outside Header ends ------ */
	
	/* ------ Login Page input field validations starts  ------ */
	
	$(".login-btn").click(function(){
		 $('#msg-field-user').html('').fadeIn(500);
		 $('#msg-field-invalid').html('').fadeIn(500);
		 $('.msgContainer').hide();
		 $('#msg-field-invalid').hide();
		 $('#msg-field-pass').html('').fadeIn(500);
		 username = $('#user-input').val();
		 password = $('#pass-input').val();
		 if(username=="") {
			 $('#user-input').focus();
			 $('.msgContainer').show();
			 $('#msg-field-user').html('Please enter Username').fadeIn(500);
			 return false;
		 }
		 if(password==""){
			 $('#pass-input').focus();
			 $('.msgContainer').show();
			 $('#msg-field-pass').html('Please enter Password').fadeIn(500);
			 return false;	
		 }else{
			 $('.overlay, .loader').fadeIn(500);
			 centerAlign('.loader');
			 
			 authenticate(username,password);
			 return false;
		 }
	});
	/* ------ Login Page input field validations ends  ------ */
	
	$('.stock-change-btn').on('click touchend', function() {
		validateAdjusments();
		return false;
	});
	
	$('#orderList .description').click(function(){
		console.log('clicked description');
		localStorage['OH_articleNumber']=$(this).parents('.levelOne').find('.articleNo');
		localStorage['pageId']='orderHistory';
		window.location='orderHistory.html';
	});
	
	$('.confirmOrderReceiptButton').on('click touchend', function() {
		var isSaved=true;
		var areItemsPresent=true;
		areItemsPresent=$('.levelThree').is(':visible');
		$.each($(".levelThree"), function () {
			console.log('Is visble : ', $(this).is(':visible'));
			console.log('has save btn : ', $(this).find(".editSaveBtn").hasClass('saveImgDiv'));
			if($(this).is(':visible') && $(this).find(".editSaveBtn").hasClass('saveImgDiv')){
				isSaved=false;
			}
			if(isSaved==false){
				return false;
			}
		});
		if(areItemsPresent){
			if(isSaved){
				var orderType = localStorage['orderType'];
				if (orderType == "ZUB") {
			        ibtToStoreInputStr();
			    }else {
					updateOrderItems();
			    }
			}else{
				$("#info-popup #popup-msg").text('Please save details to continue');
	        	$("#info-popup, .overlay").fadeIn();
	            centerAlign("#info-popup");
			}
		}else{
			$("#info-popup #popup-msg").text('No items to receive ');
        	$("#info-popup, .overlay").fadeIn();
            centerAlign("#info-popup");
		}
		return false;
	});
	$("#advancedSearch input:radio[name=sourceOfSupply]").change(function() {
		var source=$(this).val().toLowerCase();
		console.log('Selected source : ', source);
		selectSource(source);
	});
	
	$("input:radio[name=supplierType]").change(function() {
		var previousPage=localStorage['previousPage'];
		var source=$(this).val().toLowerCase();
		console.log('Selected source : ', source);
		if(source=='warehouse'){
			$('.warehouse-container').show();
			$('.vendor-container').hide();
			$('.store-container').hide();
		}else if((previousPage=='createOrder' || previousPage=='createPreq' || previousPage=='createOrderOnReceipt') && source=='vendor'){
			$('.vendor-container').show();
			$('.warehouse-container').hide();
			$('.store-container').hide();
		}else if(previousPage=='ibt' && source=='store'){
			console.log('on tsore');
			$('.store-container').show();
			$('.warehouse-container').hide();
			$('.vendor-container').hide();
		}else{
			$('.vendor-container').hide();
			$('.warehouse-container').hide();
			$('.store-container').hide();
		}
		setHeight();
		refreshScroll();
	});
	
	$("input:radio[name=kms]").change(function() {
		var distance=$(this).val().toLowerCase();
		var storeNumber=localStorage['site'];
		var salesOrg=localStorage['salesOrg'];
		var maxNoOfStores='20';
		var articleNumber=localStorage['NS_articleNumber'];
		console.log('Selected value : ', distance, articleNumber);
		$('.overlay, .loader').fadeIn();
		getOtherStoreDetails(articleNumber, storeNumber, salesOrg, distance, maxNoOfStores);
	});
	
	$('.stock-scan-btn').click(function(){
		invokeScan();
	});
	
	$('.add-item').click(function(){
		var flag =localStorage['allowAddItem'];
		if(flag == "true"){
		    $('.conditional-search').fadeIn(300, function (){
		    	$('.conditional-search').removeClass('hide');
		        myScroll.scrollToElement('.conditional-search', 100);
		        refreshScroll();
		    });
		}
		refreshScroll();
    });
	$('.edit-save').click(function(){
		var orderType=localStorage['orderType'].trim();
		var articleNumber=$(this).parents('.levelThree').find('.articleNumber').text();
		var orderedQuantity=$(this).parents('.levelThree').find('.editQrdQty ').val();
		console.log('orderedQuantity : ', orderedQuantity);
		var delDate=$(this).parent().parent().parent().find(".editDelDate").val();
		var deliveryDate=delDate;
		var uom=$(this).parents('.levelThree').find('.uom ').text();
		console.log(uom, articleNumber);
	    if($(this).attr('src')=='../images/editButton.png'){
	    	console.log('edit clicked');
			if(wool.tableExists("OrderArticleTable")){
				wool.insertOrUpdate('OrderArticleTable', {ArticleNo : articleNumber}, {
					Quantity: orderedQuantity,
					EditableField: delDate, 
					ButtonState: 'edit'
				});
				wool.commit();
	        }
			$(this).attr('src','../images/saveButton.png');
			$(this).parents('.levelThree').find(".edit-fields").removeAttr('disabled');
			$(this).parents('.levelThree').addClass('unsaved');

		}else{
			var currentDate=new Date();;
			var element=$(this).parent().parent().parent().find(".editDelDate");
			var actualDelDate=new Date();
			console.log('save clicked');
			if(orderType=='ZY' && delDate.length!=0){
				delDate=delDate.split('-');
				delDate=delDate[2]+"/"+delDate[1]+"/"+delDate[0];
				var splittedDelDate=delDate.split('/');
				//var splittedDelDateLen=delDate.split('/').length;
				var month2=splittedDelDate[1]-1;
				actualDelDate.setFullYear(splittedDelDate[2],month2,splittedDelDate[0]);
				//var splittedTwo=splittedDelDate[0]+splittedDelDate[1]+splittedDelDate[2];
			}
			if(orderType=='ZY' && delDate==""){
				$('#error-popup .head-title').text('Invalid details');
				$('#error-popup #popup-msg').text('Please enter date');
				$('#error-popup #OK').attr('onclick',"$('#error-popup, .overlay').fadeOut();");
				centerAlign('#error-popup');
				$('#error-popup, .overlay').fadeIn();
				$('#OK').click(function(e){
					$('#error-popup, .overlay').fadeOut();
					element.focus();
					//setTimeout(function(){element.focus();},50);
				});
			}else if(orderType=='ZY' && currentDate.getTime()>actualDelDate.getTime()){
				$('#error-popup .head-title').text('Invalid details');
				$('#error-popup #popup-msg').text('Please enter today date or future date');
				$('#error-popup #OK').attr('onclick',"$('#error-popup, .overlay').fadeOut();");
				centerAlign('#error-popup');
				$('#error-popup, .overlay').fadeIn();
				$('#OK').click(function(e){
					$('#error-popup, .overlay').fadeOut();
					setTimeout(function(){element.focus();},50);
				});
			}else if(orderedQuantity==0){
				$('#delete-popup .articleNo').text(articleNumber);
				$('#delete-popup, .overlay').fadeIn();
				centerAlign('#delete-popup');
			}else if(orderedQuantity<0){
				errorOkPopup("Order Quantity should not be less than zero",'.orderQty');
			}else if(orderedQuantity.trim().length==0){
				$('#delete-popup .articleNo').text(articleNumber);
				$('#delete-popup, .overlay').fadeIn();
				centerAlign('#delete-popup');
			}else if(orderedQuantity% 1 != 0 && uom!='KG'){
				errorOkPopup("Order Quantity should not contain decimals",'.orderQty');
			}else{
				$(".editDelDate").val(deliveryDate);
				if(wool.tableExists("OrderArticleTable")){
					wool.insertOrUpdate('OrderArticleTable', {ArticleNo : articleNumber}, {
						Quantity: orderedQuantity,
						EditableField: delDate, 
						ButtonState: 'save'
					});
					wool.insertOrUpdate('OrderArticleTable', {}, {
						EditableField: delDate
					});
					wool.commit();
		        }
				$(this).attr('src','../images/editButton.png');
				$(this).parents('.levelThree').find(".edit-fields").attr('disabled','disabled');
				$(this).parents('.levelThree').removeClass('unsaved');
			}
		}
	});
		
		 $('.delete-btn').click(function(){
			 var articleNumber=$(this).parents('.levelThree').find('.articleNumber').text();
			 $(this).parents('.levelThree').addClass('deleted').hide(); 
			 console.log('removeArticleFromOrder');
				if(wool.tableExists("OrderArticleTable")){
					wool.deleteRows('OrderArticleTable', {ArticleNo: articleNumber});
					wool.commit();
				}
				
				if(wool.tableExists("DeletedArticleTable")){
					if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length==0){
						wool.insert('DeletedArticleTable', {ArticleNo: articleNumber});
						wool.commit();
					}
				}
				if(localStorage['AA_addedDom'].split(' || ').length>1){
					console.log(articleNumber);
					for(var n=0; n<=localStorage['AA_addedDom'].split(' || ').length-1; n++){
						if(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber)!=-1){
							console.log(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber));
							var temp=" || "+localStorage['AA_addedDom'].split(' || ')[n];
							if(n==0){
								temp=localStorage['AA_addedDom'].split(' || ')[n];
							}
							console.log(temp);
							if(localStorage['AA_addedDeletedDOM'].length==0){
								localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'].split(' || ')[n];
							}else{
								if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
									localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'].split(' || ')[n];	
								}
							}
							var tempToo=localStorage['AA_addedDom'].replace(temp, '');
							localStorage['AA_addedDom']=tempToo;
						}
					}
				}else if(localStorage['AA_addedDom'].split(' || ').length==1){
					if(localStorage['AA_addedDom'].indexOf(articleNumber)!=-1){
						if(localStorage['AA_addedDeletedDOM'].length==0){
							localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'];
						}else{
							if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
								localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'];
							}
						}
						localStorage['AA_addedDom']='';
					}
				}
				$('.articleCount').text(wool.query('OrderArticleTable').length);
        });
		

	
	$('#order-actions').click(function(e){
		var orderStatus=localStorage['orderStatus'];
		console.log(orderStatus+"<--orderStatus in order details  page");
		var container =  $("#actions-drop");
	    if (container.is(":visible")){           
	    	container.hide();
	    }else{      
	    	container.show();
	    	if ((orderStatus == "Received")){
	    		console.log("Fully Received");
				container.find("#updateOrder").bind('click',function() {
					$('#actions-drop').hide();
					localStorage['orderDetails-firstClick']='false';
					localStorage['allowAddItem']= true;
					console.log("update");
					updateOrder();
				});
				container.find("#cancelOrder,#receiveOrder").bind('click',function(){
					$('#actions-drop').hide();
					localStorage['orderDetails-firstClick']='false';
					localStorage['allowAddItem']= true;
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('Cancel and Receive Order Not Allowed');
					$('#error-popup, .overlay').fadeIn(500);
					centerAlign('#error-popup');
				});
			}
	    	if (orderStatus == "Open") {
	    		console.log("Open");
				container.find("#updateOrder").bind('click',function() {
					localStorage['orderDetails-firstClick']='false';
					$('#actions-drop').hide();
					localStorage['allowAddItem']= true;
					console.log("update");
					updateOrder();
				});
				container.find("#cancelOrder").bind('click',function() {
					$('#actions-drop').hide();
					localStorage['orderDetails-firstClick']='false';
					localStorage['allowAddItem']= true;
					console.log("cancelOrder");
					onCancelORDER();
				});
				container.find("#receiveOrder").bind('click',function() {
					$('#actions-drop').hide();
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('Receive Order Not Allowed.');
					$('#error-popup, .overlay').fadeIn(500);
					centerAlign('#error-popup');
				});
			}
	    	if (orderStatus == "Authorized") {
				container.find("#updateOrder,#cancelOrder").bind('click',function() {
					localStorage['orderDetails-firstClick']='false';
					$('#actions-drop').hide();
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('Cancel and Update Order not Allowed');
					$('#error-popup, .overlay').fadeIn(500);
					centerAlign('#error-popup');
				});
				container.find("#receiveOrder").bind('click',function() {
					localStorage['orderDetails-firstClick']='false';
					localStorage['allowAddItem']= true;
					$('#actions-drop').hide();
					console.log("receiveOrder");
					/*receiveOrder();*/
					$('#header-title').text('Receive Order');
					receivedQty();
					docketValidation();
					//allowDocketUpdate();
				});
			}
			if (orderStatus == "Cancelled") {
				container.find("#updateOrder").bind('click',function() {
					localStorage['orderDetails-firstClick']='false';
					$('#actions-drop').hide();
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('Update Order Not Allowed');
					$('#error-popup, .overlay').fadeIn(500);
					centerAlign('#error-popup');
				});
				container.find("#receiveOrder").bind('click', function() {
					localStorage['orderDetails-firstClick']='false';
					$('#actions-drop').hide();
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('Receive Order Not Allowed');
					$('#error-popup, .overlay').fadeIn(500);
					centerAlign('#error-popup');
				});
			}
	    }
	    return false;
	});

	function receiveSapTem(){
		var hostTemp=localStorage['tempHost'];
		switch (hostTemp){
		case "yes":
			$('.temp').removeAttr("disabled    readonly").focus();
		}
	}			
				
	 function updateOrder(){
		 $('#actions-drop').hide();
		 var orderStatus = localStorage['orderStatus'];
		 if(orderStatus == "Open"){
			 
			 $(".only-open").removeClass("hide");
			 docketValidation(); 
		 }else{
		 $('#update-popup, .overlay').fadeIn(500);
		 centerAlign('#update-popup');
		 }
	 }
	 
	 function onCancelUpdate(){
		 $('#update-popup').fadeOut();
	 }
	 
	 function onCancelORDER(){
		 $('#cancel-order-popup,.overlay').fadeIn();
		 centerAlign('#cancel-order-popup');
	 }
	 
	 $('#orderSearch .select-style.vendor').change(function(){
		 var val = $(this).val();
		 if(val=='other'){
			 $('#other-vendor').show();
			 refreshScroll();
		 }else{
			 $('#other-vendor').hide();
			 refreshScroll();
		 }
	 });

	 $('#orderSearch #source').change(function(){
		 var val = $(this).val();
		 if(val=='ibt'){
			  $('.vendorSearch, .vendorOption').hide();
			  $('.ibtOption').show();
			  $('#orderSearch #vendorSearch').val('');
			  refreshScroll();
		 }else if(val == 'textBox'){
			  $('.ibtOption').hide();
			  $('.vendorSearch, .vendorOption').show();
			  $('#vendorOption').attr("disabled", 'disabled');
			  $('#orderSearch #vendorSearch').focus();
		 }else {
			  $('.ibtOption').hide();
			  $('.vendorSearch, .vendorOption').hide();
			  $('#orderSearch #vendorSearch').val('');
			  refreshScroll();
		 }
	 });
	 
	 $('#orderSearch #vendorSearch').bind('blur',function(){
		 var vendor = $(this).val();
		 console.log(vendor);
		 if(vendor!=''){
			var	getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_name eq '*"+encodeURIComponent(vendor)+"*' and iv_site eq '"+site+"'";
			var getSuppliersHeader = {
				headers : oHeaders, 
				requestUri : getSuppliersUri, 
				method : "GET",
				timeoutMS : 200000
			};
			OData.read(getSuppliersHeader, 
				function(data, response) {
					$('#vendorOption').children().remove().end().append('<option selected value="default">All</option>');
					var numberOfSuppliers=data.results.length;
					console.log('URI : ',getSuppliersUri, ' Response Length : ', data.results.length);
					if(numberOfSuppliers>1){
						for (var i = 0; i < data.results.length; i++) {
							var supplierNumber=data.results[i].vendor_no;
							var supplierName=toProperCase(data.results[i].vendor_name);
							console.log('Number : ', supplierNumber, ' Name : ', supplierName);
							$('#vendorOption').append($('<option>', { 
						        value: supplierNumber,
						        text : supplierNumber+" | "+supplierName
						    }));
							$('#vendorOption').removeAttr("disabled");
							$('.overlay, .loader').fadeOut(300);
					     }
					}else{
						$('#vendorOption').attr("disabled", 'disabled');
						var errMsg='<option selected value="default">Enter valid vendor</option>';
						$('#vendorOption').children().remove().end().append(errMsg);
						$('.overlay, .loader').fadeOut(300);
					}
				}, function(err) {
					$('.overlay, .loader').fadeOut(300);
					$('#errNoResponse').show();
				}
			);
		 }
	});

	$(document).click(function (e)
	{
	    var container =  $("#actions-drop, .div-dropDown");
	    if (container.has(e.target).length === 0)
	    {
	        container.hide();
	    }
	});
		
 	$('#viewOrderDetails .input').blur(function() {
 		console.log('Blurred!');
		 if($(this).hasClass('other-temperature')){
			 console.log('temperature!');
			 onblurFields('temperature');
		 }else if($(this).hasClass('other-invoiceNumber')){
			 console.log('invoiceNumber!');
			 onblurFields('invoiceNumber');
		 }else if($(this).hasClass('other-invoiceTotal')){
			 console.log('invoiceTotal!');
			 onblurFields('invoiceTotal');
		 }else if($(this).hasClass('other-gst')){
			 console.log('gst!');
			 onblurFields('gst');
		 }else if($(this).hasClass('other-docketNumber')){
			 console.log('docketNumber!');
			 onblurFields('docketNumber');
		 }
 	});
 	
	$('.srch-rslt-txt').click(function(){
		localStorage['checkArticleAndPlu']='false';
		localStorage['tabClicked']='SearchResults';
		console.log("localStorage['tabClicked'] : ", localStorage['tabClicked']);
		console.log('Search Results clicked.');
		var productSearchInput = localStorage['searchTerm'];
		$('.greenSep-left').css('visibility', 'visible');
		$('.greenSep-right').css('visibility', 'hidden');
		if(localStorage['typeOfInput']!='advanced'){
			if ($.isNumeric(productSearchInput)){
				console.log('isNumeric');
				if(productSearchInput.length==4){
					/*$('.other-stores-txt').removeClass('greenTab fontWhite');
					$('.other-stores-txt').addClass('fontGreen');
					$('.srch-rslt-txt').removeClass('fontGreen');
					$('.srch-rslt-txt').addClass('greenTab fontWhite');*/
					$('.srch-rslt-list').show();
					$('.other-stores-list').hide();
					console.log('==4');
					localStorage['typeOfInput']='plu';
					localStorage['checkArticleAndPlu']='true';
					localStorage['pluFlag']=false;
					localStorage['articleFlag']=false;
					localStorage['bothFlag']=false;
					checkArticleAndPlu(productSearchInput, '1');
				}else{
					if(localStorage['pageId']=='LookupList'){
						$('.overlay, .loader').fadeOut(500);
						var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
						$('#content #itemList .srch-rslt-list').html(errMsg);
					}else{
						$('.loader').fadeOut(500);
						$('.overlay, #error-popup').fadeIn(300);
						centerAlign('#error-popup');
					}
				}
			}else{
				console.log('isNotNumeric');
				/*$('.other-stores-txt').removeClass('greenTab fontWhite');
				$('.other-stores-txt').addClass('fontGreen');
				$('.srch-rslt-txt').removeClass('fontGreen');
				$('.srch-rslt-txt').addClass('greenTab fontWhite');*/
				$('.srch-rslt-list').show();
				$('.other-stores-list').hide();
				localStorage['searchTerm']=productSearchInput;
				localStorage['typeOfInput']='description';
				$('.overlay, .loader').fadeIn(500);
				centerAlign('.loader');
				productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+site+"' and iv_desc eq '*"+encodeURIComponent(productSearchInput)+"*' and iv_ranged  eq 'X'";
				console.log('With URI Prefix : ', productLookupUri);
				productLookup(productLookupUri);
			}
		}else{
			console.log('ADVANCED');
			/*$('.other-stores-txt').removeClass('greenTab fontWhite');
			$('.other-stores-txt').addClass('fontGreen');
			$('.srch-rslt-txt').removeClass('fontGreen');
			$('.srch-rslt-txt').addClass('greenTab fontWhite');*/
			$('.srch-rslt-list').show();
			$('.other-stores-list').hide();
			localStorage['tabClicked']='AdvancedSearchResults';
			console.log("localStorage['tabClicked'] : ", localStorage['tabClicked']);
			populateSearchResults(productSearchInput);
		}
	});
});

//function to convert a  string to proper CamelCcase
function toProperCase(str)
{
	// list of words to be in small case in a sentence
    var noCaps = ['of','a','the','and','an','am','or','nor','but','is','if','then', 
'else','when','at','from','by','on','off','for','in','out','to','into','with'];
    return str.replace(/\w\S*/g, function(txt, offset){
        if(offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1){
            return txt.toLowerCase();    
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//Plugin for Enter key press
$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        });
    });
};

/* ------ Login authentication service starts  ------ */ 

function authenticate(username , password){
   console.log('In authenticate');
   /* For Testing */
   /*
   localStorage['strUsername']='MOBILEPORTAL';
   localStorage['strPassword']='google2013';
   */
   /* For production */
   
   localStorage['strUsername']=username;
   localStorage['strPassword']=password;
   
   var dataString='<soapenv:Envelope'
				 +' '+'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"'
				 +' '+'xmlns:ser="http://service.portal.woolworths.com.au">'
				 +'<soapenv:Header/>'
				 +'<soapenv:Body>'
				 +'<ser:getUserInfo>'
				 +'<ser:userID>'+username+'</ser:userID>'
				 +'<ser:password>'+password+'</ser:password>'
				 +'</ser:getUserInfo>'
				 +'</soapenv:Body>'
				 +'</soapenv:Envelope>';
	console.log('dataString : ', dataString);
	/* Dev Authentication */
	//var url = 'http://clvcpd1:8380/StorePortal/services/LoginServiceImpl';
	/* Test Authentication */
	var url = 'http://cljbot1/StorePortal/services/LoginServiceImpl';
	/* Production Authentication */
	//var url='http://ngbo-prod.gss.woolworths.com.au/StorePortal/services/LoginServiceImpl';
	console.log('url : ', url);
	$.ajax({
		url: url,
		type: 'POST',
		beforeSend: function(xhr) { xhr.setRequestHeader('SOAPAction', ''); },
		dataType: "xml",
		data:dataString,
		contentType: "text/xml; charset=\"utf-8\"",
		success:  OnSuccess,
		error:  OnError
	}); 
	/* ------ Bypassing Login service for mobile VPN Testing | Store 1518 ------ */
   /*localStorage['strUsername']='MOBILEPORTAL';
   localStorage['strPassword']='google2013';
	localStorage['site']=1518;
	localStorage['userID']='xsmv5';
  	localStorage['salesOrg']=1020;
  	localStorage['userName']='Shaik Munavur Hairullah'; 
  	getSiteName(localStorage['site']);
	window.location.href="html/WoWHome.html";*/
		
		
	/* ------ Bypassing Login service for mobile VPN Testing | Store 1008 ------ */
	/*
	localStorage['site']=1008;
	localStorage['userID']='xpsi4';
  	localStorage['salesOrg']=1005;
  	localStorage['userName']='Prasanna Sankaran Gir'; 
  	getSiteName(localStorage['site']);
	window.location.href="html/WoWHome.html";
	*/
}

function OnSuccess(data){
	console.log('OnSuccess');
	console.log($(data).text());
    var error= $(data).find('getUserInfoReturn').find('errorMessage').text();
    //Authentication failed. Displaying Error message
    if(error.length>1){
	    $('.overlay, .loader').fadeOut(300);
	    console.log(error, error.length);
	    $('.msgContainer').show();
		$('#msg-field-invalid').html('Invalid User ID or Password').fadeIn(500);
    }else{
    	//Authenticated. Storing user details in localStorage.
    	var firstName=$(data).find('getUserInfoReturn').find('firstName').text();
    	var lastName=$(data).find('getUserInfoReturn').find('lastName').text();
	    var site=$(data).find('getUserInfoReturn').find('siteNo').text();
	   	var salesOrg=$(data).find('getUserInfoReturn').find('salesOrg').text();
	   	var role=$(data).find('getUserInfoReturn').find('role').text();
	   	var roleID=$(data).find('getUserInfoReturn').find('roleID').text();
	   	var siteName=$(data).find('getUserInfoReturn').find('siteName').text();
	    var userID=$('#user-input').val();
	    localStorage.userName=firstName+' '+lastName;
	    localStorage['firstName']=firstName;
	    localStorage['lastName']=lastName;
	   	localStorage['site']=site;
	  	localStorage['salesOrg']=salesOrg;
	  	localStorage['role']=role;
	  	localStorage['roleID']=roleID;
	  	localStorage['userID']=userID;
	  	localStorage['siteName']=siteName;
	  	getSiteName(site);
    }
 }
function getSiteName(site){
	var getSiteNameUri=directUriPrefix+"ZSP_STORE_LOOKUP/zsp_store_lookupCollection?$filter=iv_site_no eq '"+site+"'";
	oHeaders['Authorization'] = "Basic "+btoa("xpsn7:welcome123");
	var getSiteNameHeader = {
	        headers: oHeaders, // object that contains HTTP headers as name value pairs
	        requestUri: getSiteNameUri, // OData endpoint URI
	        method: "GET",
	        timeoutMS: 20000
	};
	console.log('getSiteNameUri : ', getSiteNameUri);
	OData.request(getSiteNameHeader,
    	function (data, response) {
			var siteName=data.results[0].site_name;
			console.log('SITE NAME SERVICE - SUCCESS : ', siteName);
			localStorage['siteName']=siteName;
			localStorage['pageId']='WoWHome';
			window.location.href="html/WoWHome.html";
		},function(err){
			console.log('SITE NAME SERVICE - ERROR : ', err);
			localStorage['siteName']='';
		});
}

//Error connecting to service. Displaying Error message
function OnError(err){
	console.log(err);
	 $('.overlay, .loader').fadeOut(300);
	 $('.msgContainer').show();
	 $('#msg-field-invalid').html('Server not responding').fadeIn(500);
}
 
 /* ------ Login authentication service ends  ------ */
 
//Dismissing keyboard on search
function keyboardDismiss(){
	$("#search-img").click(function(){
		$("#search-input").blur();
	});
}
 
/*-------------------------- Product Lookup service start --------------------------*/ 
 function productSearch(){
	localStorage['checkArticleAndPlu']='false';
	console.log('productSearch');
	var previousPage=localStorage['previousPage'];
	console.log('previousPage : ', previousPage);
	//$('#search-input').blur();
	var productSearchInput='';
	var type='';
	if(previousPage=='createOrder'){
		productSearchInput=localStorage['searchTerm_createOrder'];
		type='article';
	}else if(previousPage=='createPreq'){
		productSearchInput=localStorage['searchTerm_createPreq'];
		type='article';
	}else if(previousPage=='ibt'){
		productSearchInput=localStorage['searchTerm_ibt'];
		type='article';
	}else if(previousPage=='createOrderOnReceipt'){
		productSearchInput=localStorage['searchTerm_createOrderOnReceipt'];
		type='article';
	}else if(previousPage=='addArticle'){
		productSearchInput=localStorage['searchTerm_addArticle'];
		type='article';
	}else{
		//localStorage['tabClicked']='SearchResults';
		productSearchInput=$('#search-input').val().trim();
	}
	var productLookupUri='';
	localStorage['articleOrPlu']='false';
	console.log('ProductSearchInput : ',productSearchInput);
	if(productSearchInput!=""){
		localStorage['searchTerm']=productSearchInput;
		$('.overlay, .loader').fadeIn(300);
		centerAlign('.loader');
		console.log('Local storage search term : ',localStorage['searchTerm']);
		if ($.isNumeric(productSearchInput)){
			console.log('isNumeric');
			var searchTermLength=productSearchInput.length;
			if((searchTermLength==4 || searchTermLength>6) && type!='article'){
				console.log('==4 || >6');
				if(searchTermLength==4){
					localStorage['checkArticleAndPlu']='true';
					console.log('==4');
					$('.greenSep-left').css('visibility', 'visible');
					$('.greenSep-right').css('visibility', 'hidden');
					$('.srch-rslt-list').show();
					$('.other-stores-list').hide();
					localStorage['typeOfInput']='plu';
					localStorage['tabClicked']='';
					localStorage['checkArticleAndPlu']='true';
					localStorage['pluFlag']=false;
					localStorage['articleFlag']=false;
					localStorage['bothFlag']=false;
					//checkArticleAndPlu(productSearchInput, '1');
					localStorage['pageId']='LookupList';
					window.location='LookupList.html';
				}else{
					console.log('>6');
					localStorage['typeOfInput']='gtin';
				}
				if(localStorage['checkArticleAndPlu']!='true'){
					if(typeof prevPage != 'undefined'){
						if(prevPage=='stockAdjust' ){
							if(typeof localStorage['vendor_createOrder'] != undefined && localStorage['vendor_createOrder'] != ''){
								var vendor = localStorage['vendor_createOrder'];
								productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"' and iv_supplier eq '"+vendor+"'";
							}else {
								productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
							}
							$('.overlay, .loader').fadeIn(300);
							centerAlign('.loader');
							productLookup(productLookupUri);
						}
					}else {
						localStorage['fromXtoDetails']='Lookup';
						localStorage["pageId"] = 'LookupDetails';
						window.location = 'LookupDetails.html?'+ 'articleNumber='+ productSearchInput;
					}
				}
			}else{
				console.log('<6');
				localStorage['OPL_supplierCheckFlag']='false';
				//console.log('prevPage : ', prevPage);
				localStorage['typeOfInput']='article';
				localStorage['rangedItem']='true';
				if(typeof prevPage != 'undefined' && prevPage=='stockAdjust'){
						console.log('stockAdjust - productSearchInput : ', productSearchInput);
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
						$('.overlay, .loader').fadeIn(300);
						centerAlign('.loader');
						productLookup(productLookupUri);
				}else if(previousPage!='undefined' && previousPage=='createOrder'){
					var vendor=localStorage['searchSupplier_createOrder'];
					console.log('CREATE ORDER(ARTICLE). Vendor : ', vendor, ' Input : ', productSearchInput);
					if(vendor.trim().length==0 || vendor=='undefined'){
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					}else{
						var sos=localStorage['CO_sos'];
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+sos+"' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"' and iv_article eq '"+productSearchInput+"' and iv_ranged  eq 'X'";
					}
					$('.overlay, .loader').fadeIn(300);
					centerAlign('.loader');
					var searchKey=productSearchInput+" | "+vendor;
					orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
				}else if(previousPage!='undefined' && previousPage=='createOrderOnReceipt'){
					var vendor=localStorage['searchSupplier_createOrderOnReceipt'];
					console.log('CREATE OR(ARTICLE). Vendor : ', vendor, ' Input : ', productSearchInput);
					if(vendor.trim().length==0 || vendor=='undefined'){
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					}else{
						var sos=localStorage['COR_sos'];
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+sos+"' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"' and iv_article eq '"+productSearchInput+"' and iv_ranged  eq 'X'";
					}
					$('.overlay, .loader').fadeIn(300);
					centerAlign('.loader');
					var searchKey=productSearchInput+" | "+vendor;
					orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
				}else if(previousPage!='undefined' && previousPage=='createPreq'){
					var vendor=localStorage['searchSupplier_createPreq'];
					console.log('CREATE PREQ(ARTICLE). Vendor : ', vendor, ' Input : ', productSearchInput);
					if(vendor.trim().length==0 || vendor=='undefined'){
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					}else{
						var sos=localStorage['CP_sos'];
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+sos+"' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"' and iv_article eq '"+productSearchInput+"' and iv_ranged  eq 'X'";
					}
					$('.overlay, .loader').fadeIn(300);
					centerAlign('.loader');
					var searchKey=productSearchInput+" | "+vendor;
					orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
				}else if(previousPage!='undefined' && previousPage=='addArticle'){
					var vendor = localStorage['searchSupplier_addArticle'];
					console.log('CREATE AA(ARTICLE). Vendor : ', vendor, ' Input : ', productSearchInput);
					var sos=localStorage['AA_sos'];
					productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+sos+"' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"' and iv_article eq '"+productSearchInput+"' and iv_ranged  eq 'X'";
					if(localStorage['AA_type']=='IBT'){
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article eq '"+productSearchInput+"' and iv_site eq '"+localStorage['searchSupplier_addArticle']+"' and iv_ranged  eq 'X'";
					}
					$('.overlay, .loader').fadeIn(300);
					centerAlign('.loader');
					var searchKey=productSearchInput+" | "+vendor;
					orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
				}else if(previousPage!='undefined' && previousPage=='ibt'){
					var store =  localStorage['searchSupplier_ibt'];
					console.log('CREATE IBT(ARTICLE). site : ', store, ' Input : ', productSearchInput);
					if(store.trim().length==0 || store=='undefined'){
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article eq '"+productSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					}else{
						var sos=localStorage["CI_sos"];
						if(sos==2){
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+sos+"' and iv_supplier eq '"+store+"' and iv_site eq '"+site+"' and iv_article eq '"+productSearchInput+"'";
						}else if(sos==0){
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article eq '"+productSearchInput+"' and iv_site eq '"+store+"'";
						}
					}
					$('.overlay, .loader').fadeIn(300);
					centerAlign('.loader');
					var searchKey=productSearchInput+" | "+store;
					orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
				}else{
					console.log('PRODUCT LOOKUP - productSearchInput : ', productSearchInput);
					localStorage["pageId"] = 'LookupDetails';
					localStorage['fromXtoDetails']='Lookup';
					window.location = 'LookupDetails.html?'+ 'articleNumber='+ productSearchInput;
				}
			}
		}else{
            //alert('notNumeric');
			console.log('isNotNumeric');
			localStorage['typeOfInput']='description';
			console.log('To lookupList from productSearch()');
			localStorage['tabClicked']='SearchResults';
			productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+site+"' and iv_desc eq '*"+encodeURIComponent(productSearchInput)+"*' and iv_ranged  eq 'X'";
			$('.overlay, .loader').fadeIn(300);
			centerAlign('.loader');
			localStorage['pageId']='LookupList';
            //alert(productLookupUri);
			prodSearchFn();
			//window.location = 'LookupList.html';
		}
	}else{
		if(localStorage['pageId']=='Lookup' || localStorage['pageId']=='stockLookup'){
			$('.overlay, #no-items-popup').fadeIn(300);
			centerAlign('#no-items-popup');
		}
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Please enter search term.</div>';
		$('#content #itemList .srch-rslt-list').html(errMsg);
	}
 }
function productLookup(productLookupUri){
    alert('inside lookup');
	console.log('productLookupUri : ', productLookupUri);
	var typeOfInput=localStorage['typeOfInput'];
	var tabClicked=localStorage['tabClicked'];
	var isPresent=false;
	if(typeOfInput=='description'){
		var searchKey=localStorage['searchTerm']+" | "+tabClicked;
		isPresent=findSearchTerm(searchKey);
	}else if(typeOfInput=='advanced'){
		isPresent=findSearchTerm(localStorage['searchTerm']);
	}
	if(!isPresent){
        alert('1');
		console.log('isPresent');
		$('#content #itemList .srch-rslt-list').html('');
		if(typeOfInput=='advanced' && tabClicked==''){
			localStorage['pageId']='LookupList';
			window.location='Lookuplist.html';
		}
		else{
            alert('2');
			if(localStorage['pageId']=='LookupList'){
                alert('zfvsdhjf');
				populateSearchResults(localStorage['searchTerm']);
			}else{
                alert('3');
				console.log('To LookUpList');
				localStorage['pageId']='LookupList';
				window.location='Lookuplist.html';
			}
		}
	}else{
		console.log('typeOfInput : ', typeOfInput);
		var productLookupHeader = {
			headers : oHeaders, // object that contains HTTP headers as name value pairs
			requestUri : productLookupUri, // OData endpoint URI
			method : "GET",
			timeoutMS : 200000
		};
		OData.request(productLookupHeader,
			function (data, response){
				alert("success "+JSON.stringify(data));
				if(typeOfInput=='advanced'){
					console.log(data.results.length);
					localStorage['moreItemsAvailable']='no';
					//localstorage['advancedLength']==data.results.length;
					if(data.results.length==1 && data.results[0].msg=='No Data Found'){
						console.log(data.results[0]);
						$('#error-popup .popup-msg').text('No Item found');
						$('#error-popup, .overlay').fadeIn();
					}
					if(data.results.length==1 && data.results[0].msg!='No Data Found'){
						localStorage['Advanced_Data']=JSON.stringify(data);
						localStorage['fromXtoDetails']='Advanced';
						localStorage['pageId']='LookupDetails';
						window.location='LookupDetails.html';
					}else if(data.results.length>1){
						localStorage['multipleFrom']='advanced';
						console.log("localStorage['multipleFrom'] : ", localStorage['multipleFrom']);
						var len = data.results.length;
						console.log("Length : ", len);
						var DOM='';
						for (var i = 0; i < data.results.length; i++) {
					    	var ranged = data.results[i].ranged_flag;
						    var articleNo = data.results[i].article.replace(/^0+/, '');
						    var description = data.results[i].description;
						    var soh=data.results[i].stock_on_hand;
						    console.log('A : ',articleNo, 'D : ',description, ' R :', ranged, 'S : ', soh);
						    insertSearchResult(localStorage['searchTerm'], articleNo, description, ranged, soh); 
					    }
						localStorage['DOM']=DOM;
						localStorage['pageId']='LookupList';
						window.location='LookupList.html';
					}else{
						$('.loader').fadeOut(500);
						$('#advancedSearch #error-popup .popup-msg').text('No items to display');
						$('#error-popup,.overlay').fadeIn(300);
						centerAlign('#error-popup');
					}
				}else if(typeOfInput=='description'){
					var tabClicked = localStorage['tabClicked'];
					console.log("localStorage['tabClicked'] : ", tabClicked);
					console.log('isNotNumeric');
					if(tabClicked=='SearchResults'){
						console.log('SearchResults');
						$('.greenSep-left').css('visibility', 'visible');
						$('.greenSep-right').css('visibility', 'hidden');
						/*$('.other-stores-txt').removeClass('greenTab fontWhite');
						$('.other-stores-txt').addClass('fontGreen');
						$('.srch-rslt-txt').removeClass('fontGreen');
						$('.srch-rslt-txt').addClass('greenTab fontWhite');*/
						$('.srch-rslt-list').show();
						$('.other-stores-list').hide();
						$('#content #itemList .srch-rslt-list').html('');
						var len = data.results.length;
						alert("Length : "+ len);
						if(len>=1){
							localStorage['multipleFrom']='description';
							console.log(' MSG : ', data.results[0].msg);
							if(len==1 && data.results[0].msg=='No Data Found'){
								console.log('Length 0');
								if(localStorage['pageId']=='LookupList'){
									$('.overlay, .loader').fadeOut(500);
									var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
									$('#content #itemList .srch-rslt-list').html(errMsg);
								}else{
									$('.loader').fadeOut(500);
									$('.overlay, #error-popup').fadeIn(300);
									centerAlign('#error-popup');
								}
							}else if (len>20) {
								var rangedDOM='';
							      for (var i = 0; i < 20; i++) {
							    	 console.log(data.results[i]);
							    	 var ranged = data.results[i].ranged_flag;
								     var articleNo = data.results[i].article.replace(/^0+/, '');;
								     var description = data.results[i].description;
								     var soh=data.results[i].stock_on_hand;
								     var tab='';
								     var box='';
								     var stockText='';
								     if(soh>0){
								    	 tab='ranged-tab';
								    	 box='ranged-box';
								    	 stockText='In Stock';
								     }else{
								    	 tab='non-ranged-tab';
								    	 box='non-ranged-box';
								    	 stockText='Not in Stock';
								     }
								     rangedDOM = '<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
								     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
								     +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class = "item-desc-val grey articleNo" >'
								     +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
								     +description+'</div><input type="hidden" id="rangedFlag" value="true">'
								     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
								     +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
								     +'</tbody></table></div></div>';
								     var searchKey=localStorage['searchTerm']+" | "+tabClicked;
								     insertSearchResult(searchKey, articleNo, description, ranged, soh);
								     localStorage['moreItemsAvailable']='yes';
								     $('#content #itemList .srch-rslt-list').append(rangedDOM);
								     if(typeof prevPage!='undefined'){
								    	 if(prevPage=='stockAdjust'){
								    		 clickStockAdjust();
								    	 }
								     }else{ 
								    	 bindCLickEvent();
								     }
								     setHeight();
									 refreshScroll();
							     }
							     var moreLoader='<div class="more-loader fontWhite txtCenter" onclick="$(\'.overlay, .loader\').fadeIn(300);centerAlign(\'.loader\');loadMoreItems();">Load more items</div><input type="hidden" class="pageNumber" value="1">';
							     $('#content #itemList .srch-rslt-list').append(moreLoader);
							     setHeight();
							     refreshScroll();
							     $('.overlay, .loader').fadeOut(500);
							}else{
								var rangedDOM='';
							    for (var i = 0; i < data.results.length; i++) {
							    	console.log(data.results[i]);
							    	var ranged = data.results[i].ranged_flag;
								    var articleNo = data.results[i].article.replace(/^0+/, '');;
								    var description = data.results[i].description;
								    var soh=data.results[i].stock_on_hand;
								     var tab='';
								     var box='';
								     var stockText='';
								     if(soh>0){
								    	 tab='ranged-tab';
								    	 box='ranged-box';
								    	 stockText='In Stock';
								     }else{
								    	 tab='non-ranged-tab';
								    	 box='non-ranged-box';
								    	 stockText='Not in Stock';
								    }
								    rangedDOM = '<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
								     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
								     +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class = "item-desc-val grey articleNo">'
								     +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
								     +description+'</div><input type="hidden" id="rangedFlag" value="true">'
								     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
								     +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
								     +'</tbody></table></div></div>';
								    var searchKey=localStorage['searchTerm']+" | "+tabClicked;
								    insertSearchResult(searchKey, articleNo, description, ranged, soh);
								    localStorage['moreItemsAvailable']='no';
								    $('#content #itemList .srch-rslt-list').append(rangedDOM);
								    if(typeof prevPage!='undefined'){
								    	 if(prevPage=='stockAdjust'){
								    		 clickStockAdjust();
								    	 }
								     }else{
								    	 bindCLickEvent();
								     }
								    setHeight();
									refreshScroll();
							    }
							    $('.overlay, .loader').fadeOut(500);
							}
						}else{
							console.log('Length 0');
							if(localStorage['pageId']=='LookupList'){
								$('.overlay, .loader').fadeOut(500);
								var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
								$('#content #itemList .srch-rslt-list').html(errMsg);
							}else{
								$('.loader').fadeOut(500);
								$('.overlay, #error-popup').fadeIn(300);
								centerAlign('#error-popup');
							}
							/*var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
							$('#content #itemList .srch-rslt-list').html(errMsg);*/
							
						}
					}else if(tabClicked=='OtherStores'){
						console.log('OtherStores');
						var len = data.results.length;
						console.log("Length : ", len);
						if(len>=1){
							if(len==1 && data.results[0].msg=='No Data Found'){
								console.log('Length 0');
								$('.overlay, .loader').fadeOut(500);
								var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
								$('#content #itemList .other-stores-list').html(errMsg);
							}else{
								var nonRangedDOM='';
								for (var i = 0; i < data.results.length; i++) {
							    	
							    	var ranged = data.results[i].ranged_flag;
								    var articleNo = data.results[i].article.replace(/^0+/, '');
								    var description = data.results[i].description;
								    var soh=data.results[i].stock_on_hand;
								     var tab='';
								     var box='';
								     var stockText='';
								     if(soh>0){
								    	 tab='ranged-tab';
								    	 box='ranged-box';
								    	 stockText='In Stock';
								     }else{
								    	 tab='non-ranged-tab';
								    	 box='non-ranged-box';
								    	 stockText='Not in Stock';
								     }
								    console.log(i, articleNo, ranged, soh);
								    if(ranged=='N'){
								    	nonRangedDOM = '<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
										 +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14">'
										 +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class="item-desc-val grey articleNo">'
										 +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
										 +description+'</div><input type="hidden" id="rangedFlag" value="true">'
										 +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
										 +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
										 +'</tbody></table></div></div>';
									    var searchKey=localStorage['searchTerm']+" | "+tabClicked;
									    insertSearchResult(searchKey, articleNo, description, ranged, soh);
									    console.log(i);
									    $('#content #itemList .other-stores-list').append(nonRangedDOM);
								    }
								    //insertSearchResult(localStorage['searchTerm'], articleNo, description, ranged);
								    localStorage['moreItemsAvailable']='no';
								    if(typeof prevPage!='undefined'){
								    	 if(prevPage=='stockAdjust'){
								    		 clickStockAdjust();
								    	 }
								     }else{
								    	 bindCLickEvent();
								     }
								    setHeight();
									refreshScroll();
								}
								if($('#content #itemList .other-stores-list .lukup-lst-itm').length==0){
									var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
									$('#content #itemList .other-stores-list').html(errMsg);
								}
								$('.overlay, .loader').fadeOut(500);
							}
						}else{
							console.log('Length 0');
							$('.overlay, .loader').fadeOut(500);
							var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
							$('#content #itemList .other-stores-list').html(errMsg);
						}
						$('.overlay, .loader').fadeOut();
					}
				}else{
					console.log('LENGTH : ', data.results.length);
					if(data.results.length==0 || (data.results.length==1 && data.results[0].msg=='No Data Found')){
						var inputType=localStorage['typeOfInput'];
						console.log('InputType : ', inputType);
						if(inputType=='plu'){
							console.log('plu');
							localStorage['typeOfInput']='article';
							var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+localStorage['searchTerm']+"' and iv_site eq '"+localStorage['site']+"'";
							productLookup(productLookupUri);
						}else{
							$('.loader').fadeOut(300);
							var tableLen = $('.srch-rslt-list table').length;
							if(typeof prevPage != 'undefined' && tableLen>0){
								if(prevPage == 'stockAdjust'){
									$('#error-popup .popup-msg').text('Please select Ranged item.');
								}
							}
							else {
								$('#error-popup .popup-msg').text('Item does not exist');
							}
							$('#error-popup, .overlay').fadeIn(50);
							centerAlign('#error-popup');
						}
					}else{
						for (var i = 0; i < data.results.length; i++) {
							console.log(data.results[i]);
							if(data.results[0].msg=='No Data Found'){
								console.log('No data found');
								$('.loader').fadeOut();
								$('#error-popup .popup-msg').text('No data found');
								$('#error-popup, .overlay').fadeIn(500);
								centerAlign('#error-popup');
							}else{
								var rangedFlag = data.results[i].ranged_flag;
								if(typeof prevPage !='undefined' && prevPage =='stockAdjust'){
									console.log(rangedFlag, "SOH : ", data.results[i].stock_on_hand);
									if(rangedFlag=='Y' || (rangedFlag=='N' && data.results[i].stock_on_hand>0)){
							    		localStorage['SE_articleNumber']=data.results[i].article.replace(/^0+/, '');
										localStorage['SE_description']=data.results[i].description;
										localStorage['SE_soh']=data.results[i].stock_on_hand;
										localStorage['SE_om']=data.results[i].ord_mul;
										localStorage['SE_uom']=data.results[i].base_uom;
										localStorage["pageId"] = 'stockAdjust';
										window.location = 'stockAdjust.html';
									}else{
										var inputType=localStorage['typeOfInput'];
										if(inputType=='plu'){
											console.log('plu');
											localStorage['typeOfInput']='article';
											var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+localStorage['searchTerm']+"' and iv_site eq '"+localStorage['site']+"'";
											productLookup(productLookupUri);
										}else{
											$('.loader').fadeOut();
											$('#not-ranged-popup, .overlay').fadeIn(300);
											centerAlign('#not-ranged-popup');
										}
									}
								}else{
									console.log('ARTICLE DETAILS FOUND');
									var articleNumber = data.results[i].article.replace(/^0+/, '');
									var description = data.results[i].description;
									var rangedItem=data.results[i].ranged_flag;
									console.log('rangedItem', rangedItem);
									console.log(localStorage['rangedItem']);
									if(localStorage['rangedItem']!='false' || rangedItem!='N'){
										var stockOnHand = data.results[i].stock_on_hand;
										var stockInTransit = data.results[i].stock_in_transit;
										var stockOnOrder = data.results[i].stock_on_order;
										var salesPrice = data.results[i].sales_price;
										var promoPrice = data.results[i].promo_sales_price;
										localStorage['salesPrice'] = salesPrice;
										//var promoFromDate = data.results[i].promo_from_date;
										if(promoPrice>0){
											var promoToDate = data.results[i].promo_to_date;
											var promoPeriod='';
											if(promoToDate!=''){
												var promoDateFormat=promoToDate.split('.');
												var promoDay=promoDateFormat[0];
												var promoMonth=promoDateFormat[1];
												var promoYear=promoDateFormat[2];
												var formatDate = promoMonth+ "/" +promoDay+ "/" +promoYear;
												console.log ( "formatDate", formatDate );
												var promoPeriodFormat = new Date(formatDate);
												var promDay = promoPeriodFormat.getDay();
												var promMonth = promoPeriodFormat.getMonth();
												var day = [ "Sunday", "Monday" , "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
												var month = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
												var pDay = day[promDay];
												var pMonth = month[promMonth];
												var pDate = promoPeriodFormat.getDate();
												console.log("pDay",pDay);
												console.log("pMonth",pMonth);
												console.log("pDate",pDate);
												var pSuffix;
												if(pDate == "1" ) {
													pSuffix = "st";
												}
												else if(pDate == "2" ) {
													pSuffix = "nd";
												}
												else if(pDate == "3" ) {
													pSuffix = "rd";
												}
												else {
													pSuffix = "th";
												}
												promoPeriod=/*promoFromDate+' '+ promoToDate; */ pDay+", "+pDate+pSuffix+" "+pMonth;
											}
											console.log("promoPeriod", promoPeriod);
											$('#promoPrice').text("$ "+promoPrice);
											if(promoPeriod!='' || promoPeriod=='undefined'){
												$('.till').show();
											}
											$('#promoPeriod').text(promoPeriod);
											$('.other-basic-details').show();
										}else{
											$('.no-promo').show();
										}
										var orderMultiple = data.results[i].ord_mul;
										localStorage['OM'] = orderMultiple;
										var daysOnHand = data.results[i].days_on_hand;
										var mpl = data.results[i].curr_mpl;
										if(mpl=='0'){
											mpl='';
										}
										var shelfCapacity = data.results[i].shelf_capacity;
										
										var lastRecDate = data.results[i].last_del_date;
										var lastOrderedQuantity = data.results[i].last_ord_qty;
										var lastRecQuantity = data.results[i].last_rcv_qty;
										var nextDeliveryDate = data.results[i].next_del_date;
										var nextOrderedQuantity = data.results[i].next_ord_qty;
										var defMpl = data.results[i].def_mpl;
										var defSelfCap = data.results[i].shelf_capacity;
										var promType = data.results[i].promo_type;
										var promPrice = data.results[i].promo_sales_price;
										var uom=data.results[i].base_uom;
										var unitEAN = data.results[i].ean11;
										var unitPLU = data.results[i].plu;
										var unitBrand =data.results[i].brand_name;
										var perpetualFlag = data.results[i].perpetual_flag;
										console.log( 'EAN: ', unitEAN, 'plu: ', unitPLU, 'brand: ', unitBrand, 'perpetualFlag: ', perpetualFlag );
										//if ( perpetualFlag == "" || perpetualFlag == "undefined" ) {
										//	$("#perpetual").removeClass('.perpFlag');
										//}
										//else {
										//	$("#perpetual").addClass('perpFlag');
										//}
										var sellPriceGroup = data.results[i].pl_type+' - '+data.results[i].pl_type_desc;
										var Origin = data.results[i].country_origin;
										var supplierName = data.results[i].supp_name;
										var supplierNo = data.results[i].supp_no;
										localStorage['descriptionFull']=description;
										$('#articleNumber').text(articleNumber);
										//$('#description').text(" "+description.slice(0,12)+"...");
										$('#description').text(description);
										$('#salesPrice').text("$ "+salesPrice);
										if(uom=="EA"){
											stockOnHand=parseInt(stockOnHand);
											stockOnOrder=parseInt(stockOnOrder);
											stockInTransit=parseInt(stockInTransit);
											}
										$('#stockOnHand').text(stockOnHand+' '+uom);
										$('#stockOnOrder').text(stockOnOrder+' '+uom);
										$('#stockInTransit').text(stockInTransit+' '+uom);
										$('#orderMultiple').text(orderMultiple);
										$('#daysOnHand').text(daysOnHand);
										$('#mpl').text(mpl);
										$('#shelfCapacity').text(shelfCapacity);
										$('#lastRecDate').text(lastRecDate);
										$('#lastOrderedQuantity').text(lastOrderedQuantity);
										$('#lastRecQuantity').text(lastRecQuantity);
										$('#nextDeliveryDate').text(nextDeliveryDate);
										$('#nextOrderedQuantity').text(nextOrderedQuantity);
										$('#defaultMpl').text(defMpl);
										$('#defaultShelfCapacity').text(defSelfCap);
										$('#promType').text(promType);
										$('#promPrice').text("$ "+promPrice);
										$('#supplyName').text(supplierName);
										$('#supplyNo').text(supplierNo);
										$('#unitEAN').text(unitEAN);
										$('#unitUOM').text(uom);
										$('#unitPLU').text(unitPLU);
										$('#unitBrand').text(unitBrand);
										$('#sell-price-group').text(sellPriceGroup);
										$('#origin').text(Origin);
										var forSaleFlag=data.results[i].for_sale_flag;
										console.log('FOR SALE FLAG : ', forSaleFlag);
										if(forSaleFlag=='N'){
											$('.not-for-sale').show();
										}else if(forSaleFlag=='Y'){
											$('.not-for-sale').hide();
										}
										localStorage['rangedFlag']=rangedFlag;
										var stockClass='';
										var stockText='';
										if(stockOnHand>0){
											stockClass='ranged-box';
											stockText='In Stock';
										}else{
											stockClass='non-ranged-box';
											stockText='Not in Stock';
										}
										if(rangedFlag=='Y'){
											$('.ranged-tick').show();
											$('.non-ranged-dash').hide();
											$('.ranged-flag').text('Ranged');
										}else{
											console.log('show hide');
											$('.ranged-tick').hide();
											$('.non-ranged-dash').show();
											$('.ranged-flag').text('Non - Ranged');
											$('.order-footer-btn').hide();
											$('.cor-footer-btn').hide();
											document.getElementById('nearby-footer-btn').style.height='100%';
											document.getElementById('stock-footer-btn').style.height='100%';
											document.getElementById('footer-container').style.height='60px';
											if(stockOnHand<=0){
												$('.stock-footer-btn').hide();
												document.getElementById('nearby-footer-btn').style.background="none";
											}
										var deleteFlag = data.results[i].delete_ind;
										if( deleteFlag == "Y" ) {
											$('.deleted-dash').show();
											$('.deleted-flag').show();
										} 
										else {
											$('.deleted-dash').hide();
											$('.deleted-flag').hide();
										}
										}
										$('.stock-flag').addClass(stockClass);
										$('.stock-flag').text(stockText);
									}
									localStorage['articleNumber']=articleNumber;
									localStorage['description']=description;
									var cpu = data.results[i].comp_price_unit;
									localStorage['cpu']=cpu;
									var ean = data.results[i].ean11;
									localStorage['ean']=ean;
									
									var department = data.results[i].department;
									var departmentName = data.results[i].dept_name;
									var dept='';
									if(department.trim().length>0 && departmentName.trim().length>0){
										dept=department+" | "+departmentName;
									}else if(department.trim().length==0){
										dept=departmentName;
									}else if(departmentName.trim().length==0){
										dept=department;
									}
									console.log(department, departmentName, dept);
									localStorage['department']=dept;
									var category = data.results[0].category;
									//var categoryCode=category.split(department)[1];
									var categoryName = data.results[0].cat_name;
									var cat='';
									if(category.trim().length>0 && categoryName.trim().length>0){
										cat=category+" | "+categoryName;
									}else if(category.trim().length==0){
										cat=categoryName;
									}else if(categoryName.trim().length==0){
										cat=category;
									}
									console.log(category, categoryName, cat);
									localStorage['category']=cat;
									var subCategory = data.results[0].sub_category;
									//var subCategoryCode = subCategory.split(category)[1];
									var subCategoryName = data.results[0].sub_cat_name;
									var subCat='';
									if(subCategory.trim().length>0 && subCategoryName.trim().length>0){
										subCat=subCategory+" | "+subCategoryName;
									}else if(subCategory.trim().length==0){
										subCat=subCategoryName;
									}else if(subCategoryName.trim().length==0){
										subCat=subCategory;
									}
									console.log(subCategory, subCategoryName, subCat);
									localStorage['subCategory']=subCat;
									var segment = data.results[0].segment;
									//var segmentCode=segment.split(subCategory)[1];
									var segmentName = data.results[0].segment_name;
									var seg='';
									if(segment.trim().length>0 && segmentName.trim().length>0){
										seg=segment+" | "+segmentName;
									}else if(segment.trim().length==0){
										seg=segmentName;
									}else if(segmentName.trim().length==0){
										seg=segment;
									}
									console.log(segment, segmentName, seg);
									localStorage['segment']=seg;
									var grossProfit = data.results[i].sell_effective_gp;
									localStorage['grossProfit']=grossProfit;
									var purchasePrice = data.results[i].purch_price;
									localStorage['purchasePrice'] = purchasePrice;
									var gst = data.results[i].gst;
									localStorage['gst']=gst;
									var vendor = data.results[i].vendor_sku;
									localStorage['vendor']=vendor;
									var sourceOfSupply = data.results[i].src_of_supp;
									if(sourceOfSupply=='1'){
										sourceOfSupply='Vendor';
									}else if(sourceOfSupply=='2'){
										sourceOfSupply='Warehouse';
									}
									localStorage['sourceOfSupply']=sourceOfSupply;
									/*var supplierDesc = data.results[i].src_of_supp_desc;
									localStorage['supplierDesc']=supplierDesc;*/
									var supplierNumber=data.results[i].supp_no;
									var supplierName=data.results[i].supp_name;
									if(supplierName=='' && supplierNumber==''){
										localStorage['supplierDesc']='';
									}else if(supplierName==''){
										localStorage['supplierDesc']=supplierNumber;
									}else if(supplierNumber==''){
										localStorage['supplierDesc']=supplierName;
									}else{
										localStorage['supplierDesc']=supplierNumber+" | "+supplierName;
									}
									var perpetualFlag = data.results[i].perpetual_flag;
									localStorage['perpetualFlag']=perpetualFlag;
									var srt = data.results[i].srt;
									localStorage['srt']=srt;
									var plu = data.results[i].plu;
									localStorage['plu']=plu;
									localStorage['baseQty']=data.results[i].base_uom;
									var packBreakdownFlag=data.results[i].pack_brk_flag;
									localStorage['packBreakdownFlag']=packBreakdownFlag;
									var securityItem=data.results[i].eas_ind;
									if(securityItem.trim()==''){
										securityItem='N';
									}
									localStorage['securityItem']=securityItem;
									//if(localStorage['rangedItem']=='false'){
										fillAdditionalDetails();
									//}
									$('#baseQty').val(data.results[i].base_uom);
									//$('.overlay, .loader').fadeOut(500);
									
								}
							}
						}
					}
				}
			},function(err){
				$('.loader').fadeOut(300);
				if(err.response.statusCode=='400'){
					$('.overlay, .loader').fadeOut(500);
					var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
					$('#content #itemList .other-stores-list').html(errMsg);
					$('#content #itemList .srch-rslt-list').html(errMsg);
				}else{
					$('#error-popup .popup-msg').text('Server not responding');
					$('#error-popup').fadeIn(300);
					centerAlign('#error-popup');
				}
				console.log("Error! No response received.", err.message);
			}
		);
	}
}
	 
function addItem(){
	$('#search-input').blur();
	var productSearchInput=$('#search-input').val();
	var addItemUri='';
	console.log('ProductSearchInput : ',productSearchInput);
	if(productSearchInput!=""){
		$('.overlay, .loader').fadeIn(300);
		centerAlign('.loader');
		if ($.isNumeric(productSearchInput)){
			console.log('isNumeric');
			var searchTermLength=productSearchInput.length;
			if(searchTermLength==4 || searchTermLength>6){
				console.log('==4 || >6');
				if(searchTermLength==4){
					console.log('==4');
					localStorage['inputType']='plu';
				}else{
					console.log('>6');
					localStorage['inputType']='gtin';
				}
				addItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
			}else{
				localStorage['inputType']='article';
				addItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
			}
		}
		callAddITem(productSearchInput,addItemUri);
	}else{
		//popup to fill empty field
	}	
}

function performCheckOrder(productSearchInput,description,packSize){
	//var orderStatus = 'Open';
	var currentDate= new Date();
	var toDate = currentDate.toISOString().slice(0,10).replace(/-/g,"");
	var fromDate = currentDate.toISOString().slice(0,10).replace(/-/g,"");
	addItemUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_article  eq '"+productSearchInput+"'  and iv_delivery_todate eq '"+toDate +"' and iv_delivery_fromdate eq '"+fromDate +"' and iv_site eq '"+site+"'";
	console.log(addItemUri);
	var addItemHeader = {
	        headers: oHeaders, // object that contains HTTP headers as name value pairs
	        requestUri: addItemUri, // OData endpoint URI
	        method: "GET",
	        timeoutMS: 20000
	};
	OData.request(addItemHeader,
    	function (data, response) {
			if (data.results.length >= 1) {
				var msg=data.results[0].msg;
				//var description = data.results[0].order_type_desc;
				if(msg == "No Data Found" || !$.isNumeric(msg)){
					addItemInExistingOrder(productSearchInput,description,packSize);
					$('#back-popup,.overlay').fadeOut();
					$('.loader').fadeOut(500);
					refreshScroll();
				}else{
					$('#addItem-popup #addItem-OK').attr("onclick", "addItemInExistingOrder("+productSearchInput+",'"+description+ "');$('#back-popup,.overlay').fadeOut();");
					$('.loader').fadeOut(500);
					$('#addItem-popup,.overlay').fadeIn(500);
					centerAlign('#addItem-popup');
					refreshScroll();
				}
			}
		},function(err){
			console.log(err);
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Add Item');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('#cancel-order-status,.overlay').fadeOut();");
			$('#cancel-order-status, .overlay').fadeIn();
			centerAlign('#cancel-order-status');
		}
	);
}

function addItemInExistingOrder(itemNumber,description,packSize){
	var addItem = '<div data-itemNumber="'+itemNumber+ '" class="new not-received">'+
		'<table  class="item-details borderSep fullWidth orderItems black font14 ">'+
		'<tbody>'+
		'<tr>'+
		'<td class="item-txt text-align-right">'+
		'Item Desc'+
		'</td>'+
		'<td  colspan="3" class="item-val dark-green description">'+
		description+
		'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="item-txt text-align-right">'+
		'Item no'+
		'</td>'+
		'<td  class="item-val dark-green itemNumber">'+
		itemNumber+
		'</td>'+
		'<td class="item-txt text-align-right">'+
		'Pack Size'+
		'</td>'+
		'<td  class="item-val dark-green packSize">'+
		'<input data-role="none" type="tel" class="input focus pack-qty" value="'+packSize+'"'+
		'readonly="readonly"/>'+
		'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="item-txt text-align-right">'+
		'Ordered Qty'+
		'</td>'+
		'<td  class="item-val dark-green ordered-qty">'+
		'</td>'+
		'<td class="item-txt text-align-right">'+
		' Received Qty'+
		'</td>'+
		'<td  class="item-val dark-green width25">'+
		'<input data-role="none" type="tel" class="input focus received-qty" value=""'+
		'readonly="readonly"/>'+
		'<input type="hidden" class="item-status" value="Open" />'+
		'<input type="hidden" class="item-no" value="" />'+
		'</td>'+
		'</tr>'+
		'</tbody>'+
		'</table>'+
		'<div class="hide hiddenButtons buttons">'+
		'<div  class="item-val dark-green">'+
		'<input type="button" data-role="none" class="update-btn green-btn" value="Update"/>'+
		'</div>'+  
		'<div class="item-txt text-align-right">'+
		'<input type="button" data-role="none" class=" green-btn confirm-btn" value="Confirm"/>'+
		'</div>'+
		'</div>'+
		'</div>';
    console.log(addItem);
    var t = $("#listItem");
    t.prepend(addItem);
	//hiddenBtns();
	//enableDocketFinalize();
    //itemExists = true;
	allowDocketUpdate();
    $('#addItem-popup,.overlay').fadeOut(500);
    refreshScroll();
}

function callAddITem(productSearchInput,addItemUri) {
	var addItemHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: addItemUri, // OData endpoint URI
        method: "GET",
        timeoutMS: 20000
    };
    OData.request(addItemHeader,
    	function (data, response) {
    		console.log("data.results.length",data.results.length);
    		if (data.results.length > 0) {
    			console.log('addItemUri : ', addItemUri);
    			var selectedOption = {};
    			var foundItem = {};
    			console.log('Site search URI : ', data.results[0]);
    			var description = data.results[0].description;
    			var packSize= data.results[0].ord_mul;
    			var itemNumber = data.results[0].article.trim().substr(-6).replace(/^0+(?!\.|$)/, '');
    			console.log("itemNumber from ws:----> ",itemNumber,"description FROM ws :---->",description,"packSize from WS :---->", packSize);
    			var itemExists = false;
    			$.each($(".new"), function () {
    				selectedOption = $(this);
    				var itemNo = selectedOption.attr('data-itemNumber').trim().substr(-6).replace(/^0+(?!\.|$)/, '');
    				console.log('itemNo : ', itemNo, 'itemNumber : ', itemNumber);
    				if (itemNo === itemNumber ) {
    					foundItem = selectedOption;
    					itemExists = true;
    				}
    			});
				if(itemExists === true){
					var listobjClone = foundItem.clone();
					foundItem.remove();
                    var t = $("#listItem");
                    t.prepend(listobjClone);
                    itemExists = true;
                    allowDocketUpdate();
                    $('.overlay, .loader').fadeOut(300);
                    refreshScroll();
                }else {
                	console.log("inside else");
                	performCheckOrder(productSearchInput,description,packSize);
                }
			}else{
				console.log("Inside else");
				$('.loader').fadeOut();
				$('#error-popup .popup-msg').text('Arcticle not found');
				$('#error-popup, .overlay').fadeIn();
				centerAlign('#error-popup');
				refreshScroll();
			}
		}, function (err) {
            console.log('Err : ', err);
            $('.loader').fadeOut(300);
            $('#error-popup .popup-msg').text('Server is not responding');
            $('#error-popup, .overlay').fadeIn(500);
            centerAlign('#error-popup');
            refreshScroll();
        }
	);
}

/*--------------------------  View Order Service starts --------------------------*/ 
function orderSearchList(site,delivery_todate,delivery_fromdate){
    $('.overlay, .loader').fadeIn(300);
    centerAlign('.loader');
    updateUri = uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '" + site + "' and iv_delivery_todate eq '" + delivery_todate + "' and iv_delivery_fromdate eq '" + delivery_fromdate + "'";
    var successRec=localStorage['successReceive'];
	if(successRec == "true"){
		updateUri=localStorage['currentUrl'];
		localStorage['successReceive']="false";
	}
    
    localStorage['currentUrl']=updateUri;
    console.log("updateUri:--------->" + updateUri);
    var updateItemHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: updateUri, // OData endpoint URI
        method: "GET",
    };
    OData.request(updateItemHeader,
        function (data, response){
    	var t = $("#viewOrder-details");
    	t.html('');
            console.log(data.results.length);
            
            var noOfItems=data.results.length;
            //if(noOfItems <20)
            	var j  = noOfItems;
           // else
            	//j = 20;
            if(data.results.length >0){
            	var msg = data.results[0].msg.trim();
            	if (msg != 'No Data Found'){
            		
            for (var i = 0; i < j; i++){
            	var departmentNo=data.results[i].trading_dep_no;
            	console.log('departmentNo : ', departmentNo);
            	var temp =data.results[i].temp_check1;
    			localStorage['tempCheck']=temp;
    			console.log('temperature :', temp);
                var order_no = data.results[i].order_no;
                var order_type = data.results[i].order_type;
                var order_type_desc = data.results[i].order_type_desc;
                if(order_type_desc=="Purchase requisition"){
            		console.log('orderTypeDescription');
            		order_type_desc='PReq';
            	}
                var orderStatus = data.results[i].order_status;
                var preqType=data.results[i].preq_type;
                if(preqType == "ZX" || preqType == "ZY"){
	    			var poNumber=data.results[i].order_no;
	    			console.log('Preq no : ', order_no, ' Order No : ', poNumber);
	    			if(poNumber.trim().length==0){
	    				orderStatus ="Open";
	    			}else{
	    				orderStatus ="Closed";
	    			}
	    			order_no=data.results[i].preq_no;
	    			order_type=data.results[i].preq_type;
	    			order_type_desc=data.results[i].preq_type_desc;
	    		}
                var iv_delivery_todate = data.results[i].delivery_date;
                var total_cartons = data.results[i].total_cartons;
                total_cartons=parseFloat(total_cartons);
                var roster_date = data.results[i].roster_date;
                var supp_name = data.results[i].supp_name;
                var supp_no = data.results[i].supp_no;
                var vendor = '';
                var creationDate = '';
                var receivingStore = site;
                var sendingStore = supp_no;
               
                var box ;
        		if (orderStatus == "Cancelled"){
        			box = "notreceived-box" ;
        		}
        		else{
        			box ="received-box";
        		}
                insertIntoViewOrderTable(vendor, order_no, iv_delivery_todate, creationDate, receivingStore, sendingStore, total_cartons, order_type, order_type_desc, orderStatus, roster_date, supp_no, supp_name,departmentNo);
                var item;
                if (order_type === "ZUB"){
                	item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
	    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
	    		     +'<tbody>'
	    		     +'<tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription bold green">Order</span>#<span class="orderNo green bold">'+order_no+'</span><span class="grey absoluteRight normal">'
	    		     +order_type_desc+'</span></td></tr><tr><td colspan="2" class="item-desc-val grey description suppName normal"><div class="normal to-lookup-Div">'
	    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
	    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
	    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
	    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
	    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
	    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span><span class="grey absoluteRight normal">Total Cartons:&nbsp;'+total_cartons+'</span></td></tr>'
	    		     +'</tbody></table></div></div>';
                    
                    t.append(item);
                }else{
                	item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
	    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
	    		     +'<tbody><tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription green bold ">Order &nbsp;# </span><span class="orderNo green bold">'+order_no+'</span><span class="grey absoluteRight normal">'
	    		     +order_type_desc+'</span>&nbsp</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName normal"><div class="to-lookup-Div normal">'
	    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
	    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
	    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
	    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
	    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
	    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span><span class="grey absoluteRight normal">Total Cartons:&nbsp;'+total_cartons+'</span></td></tr>'
	    		     +'</tbody></table></div></div>';
                    
                    t.append(item);
                }
                if(!$('.levelThree').is(':visible')){
                	console.log('No items visible');
                	var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
                	
                	t.html(j);
                	$(".overlay,.loader").fadeOut()  ;
                }else{
                	console.log('Removing errNoResponse');
                	$('#errNoResponse').remove();
                }
                $('.overlay, .loader').fadeOut(300);
                setHeight();
                refreshScroll();
                onClickViewOrder();
            }}
            	else{
            		console.log("Deleting view order table");
            		//wool.dropTable("viewOrder");
            		var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
                	t.append(j);
                	$(".overlay,.loader").fadeOut()  ;
                	}
            	}
            else{
            	var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
            	
            	t.append(j);
            	$(".overlay,.loader").fadeOut()  ;
            	}
        }, function (err) {
        		console.log('Error. ', err);
            	$('.loader').fadeOut();
            	$("#searchFailedPopup,.overlay").fadeIn();
        		centerAlign("#searchFailedPopup");
        });
}

function orderList(site,orderType,orderNo,order_status,delivery_fromdate,delivery_todate,sos,supplier,pageNo,records,iv_trac_no){
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var flag= localStorage['barcodeScan'];
	var pReqFlag= localStorage['pReqFlag'];
	localStorage['barcodeScan']="false";
	console.log("site type ",site);
	updateUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNo+"' and iv_order_status eq '"+order_status+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"' and iv_sos eq '"+sos+"' and iv_supplier eq '"+supplier+"' and iv_trac_no eq '"+iv_trac_no+"'" ;
	if(orderType=='ZY' || orderType=='ZX'){
		localStorage['ibtSearchFlag']='false';
		updateUri=uriPrefix+"ZSP_PR_ENQ_HEADER/zsp_pr_enq_headerCollection?$filter=iv_site eq '"+localStorage['site']+"' and iv_preq_type eq '"+orderType+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"'" ;
	}
	if(site=="ZUBOUT"){
		updateUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNo+"' and iv_order_status eq '"+order_status+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"' and iv_sos eq '"+sos+"' and iv_supplier eq '"+supplier+"'and iv_trac_no eq '"+iv_trac_no+"'" ;
		site=localStorage['site'];
	}
	if(site=='ZUBALL'){
		updateUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+localStorage['site']+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNo+"' and iv_order_status eq '"+order_status+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"' and iv_sos eq '"+sos+"' and iv_supplier eq '"+supplier+"'and iv_trac_no eq '"+iv_trac_no+"'" ;
		site=localStorage['site'];
	}
	var successRec=localStorage['successReceive'];
	if(successRec == "true"){
		updateUri=localStorage['currentUrl'];
		localStorage['successReceive']="false";
	}
	if(flag == "true"){
		updateUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+orderNo+"' " ;
	}
	if(pReqFlag == "true"){
		updateUri=uriPrefix+"ZSP_PR_ENQ_HEADER/zsp_pr_enq_headerCollection?$filter=iv_site eq '"+site+"' and iv_preq_no eq '"+orderNo+"'";
		
	}
	console.log('URI : ', updateUri);
	localStorage['currentUrl']=updateUri;
	console.log("updateUri:--------->",localStorage['ibtSearchFlag']);
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	var updateItemHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: updateUri, // OData endpoint URI
        method: "GET",
        
    };
    OData.request(updateItemHeader, 
    	function(data,response){
    	console.log(data.results);
			var msg=data.results[0].msg;
			var t = $("#viewOrder-details");
			t.html('');
			if($.isNumeric(msg) || msg == ""){
				
				console.log("data results",data.results[0].msg);
				var noOfItems=data.results.length;
		            console.log(data.results.length);
				for (var i = 0; i < noOfItems; i++) {
		    		var order_no=data.results[i].order_no;
		    		var order_type=data.results[i].order_type;
		    		var preqType=data.results[i].preq_type;
		    		
		    		var orderStatus='';
		    		var order_type_desc='';
		    		if( order_type != undefined){
		    			
		    			order_type_desc=data.results[i].order_type_desc;
		    			if(order_type_desc=="Purchase requisition"){
		            		console.log('orderTypeDescription');
		            		order_type_desc='PReq';
		            	}
		    			var roster_date=data.results[i].roster_date;
		    			orderStatus=data.results[i].order_status;
		    			
		    		}
		    		if(pReqFlag == "true" || orderType == "ZX" || orderType == "ZY"){
		    			
		    			order_no=data.results[i].preq_no;
		    			var poNumber=data.results[i].order_no;
		    			console.log('Preq no : ', order_no, ' Order No : ', poNumber);
		    			if(poNumber.trim().length==0){
		    				orderStatus ="Open";
		    			}else{
		    				orderStatus ="Closed";
		    			}
		    			
		    			order_type=preqType;
		    			order_type_desc=data.results[i].preq_type_desc;
		    		}
		    		var box ;
		    		if (orderStatus == "Cancelled"){
		    			box = "notreceived-box" ;
		    		}
		    		else{
		    			box ="received-box";
		    		}
		    		var iv_delivery_todate=data.results[i].delivery_date;
		    		var total_cartons=data.results[i].total_cartons;
		    		total_cartons=parseFloat(total_cartons);
		    		var supp_name=data.results[i].supp_name;
		    		var supp_no=data.results[i].supp_no;
		    		var vendor = supp_no;
		    		var departmentNo =data.results[i].trading_dep_no;
		    		console.log('departmentNo : ', departmentNo);
		    		var creationDate='';
		    		var receivingStore = data.results[i].recv_site;
		    		var sendingStore=supp_no;

		    		console.log('total_cartons(search): ', total_cartons, ' results: ', data.results[i]);
		    		insertIntoViewOrderTable(vendor, order_no, iv_delivery_todate, creationDate, receivingStore, sendingStore, total_cartons, order_type, order_type_desc, orderStatus, roster_date, supp_no, supp_name,departmentNo);

		    		var item;
		    		if(order_type === "ZUB"){
		    			 /*item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
		    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		    		     +'<tbody><tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription">'+order_type_desc+'</span>#<span class="orderNo">'+order_no+'</span></td><td class="item-desc-val grey articleNo"><span class="cartons-no-lukup-list">'
		    		     +total_cartons+'</span>&nbsp;Cartons</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div">'
		    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
		    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
		    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span></td></tr>'
		    		     +'</tbody></table></div></div>';*/
		    			item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
		    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		    		     +'<tbody>'
		    		     +'<tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription bold green">Order</span>#<span class="orderNo green bold">'+order_no+'</span><span class="grey absoluteRight normal">'
		    		     +order_type_desc+'</span></td></tr><tr><td colspan="2" class="item-desc-val grey description suppName normal"><div class="normal to-lookup-Div">'
		    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
		    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
		    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span><span class="grey absoluteRight normal">Total Cartons:&nbsp;'+total_cartons+'</span></td></tr>'
		    		     +'</tbody></table></div></div>';
		    			 console.log('Printing');
		    		t.append(item);
	    		}else{
	    			/*item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
	    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
	    		     +'<tbody><tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription">'+order_type_desc+'</span> #<span class="orderNo">'+order_no+'</span></td><td class="item-desc-val grey articleNo"><span class="cartons-no-lukup-list">'
	    		     +total_cartons+'</span>&nbsp;Cartons</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div">'
	    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
	    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
	    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
	    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
	    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
	    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span></td></tr>'
	    		     +'</tbody></table></div></div>';*/
	    			console.log(orderType, orderStatus);
	    			if((orderType == "ZX" || orderType == "ZY") && (order_status=='' || orderStatus==order_status)){
		    			item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
		    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		    		     +'<tbody><tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription green bold ">Order &nbsp;# </span><span class="orderNo green bold">'+order_no+'</span><span class="grey absoluteRight normal">'
		    		     +order_type_desc+'</span>&nbsp</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName normal"><div class="to-lookup-Div normal">'
		    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
		    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
		    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span><span class="grey absoluteRight normal">Total Cartons:&nbsp;'+total_cartons+'</span></td></tr>'
		    		     +'</tbody></table></div></div>';
		    			console.log('Printing');
		    			t.append(item);
		    		}else if(orderType != "ZX" && orderType != "ZY") {
		    			item = '<div class="levelThree"><div class="levelTwo orderListH '+orderStatus+'"></div>'
		    		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		    		     +'<tbody><tr><td class="item-desc-txt orderTypedesc grey"><span class="orderTypeDescription green bold ">Order &nbsp;# </span><span class="orderNo green bold">'+order_no+'</span><span class="grey absoluteRight normal">'
		    		     +order_type_desc+'</span>&nbsp</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName normal"><div class="to-lookup-Div normal">'
		    		     +supp_no+" | "+supp_name+'</div><input type="hidden" class="orderDeliveryDate" value="'+iv_delivery_todate+'">'
		    		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		    		     +'<input type="hidden" class="orderType" value="'+order_type+'">'
		    		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		    		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		    		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span><span class="grey absoluteRight normal">Total Cartons:&nbsp;'+total_cartons+'</span></td></tr>'
		    		     +'</tbody></table></div></div>';
		    			console.log('Printing');
		    			t.append(item);
		    		}
	    		}
	    		if(!$('.levelThree').is(':visible')){
	    			console.log('No items visible');
                	var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
                	
                	t.html(j);
                	$(".overlay,.loader").fadeOut()  ;
                }else{
                	console.log('Removing errNoResponse');
                	$('#errNoResponse').remove();
                }
	    		$('.overlay, .loader').fadeOut(300);
	    		setHeight();
	            refreshScroll();
	            onClickViewOrder();
	    	}
				
				/*if(noOfItems == 10){
				 if(pageNo == 1){
				 var moreLoader='<div class="more-loader fontWhite txtCenter" onclick="$(\'.overlay, .loader\').fadeIn(300);centerAlign(\'.loader\');loadMoreOrderItems('+orderNo+');">Load more items</div>';
				 console.log(moreLoader);
				 //$('#scroller').append(moreLoader);
				 t.append(moreLoader);
				 setHeight();
		            refreshScroll();
				 }
				 pageNo =pageNo +1;
					console.log("page number is ;__-->",pageNo);
					localStorage['pageNo'] =pageNo;
				}*/
				
    	}else{
    		console.log("inside failure");
    		if(pReqFlag=="true"){
    			console.log("preq flag is set true");
    			var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
            	t.html(j);
            	$(".overlay,.loader").fadeOut();
    		}else if(orderType==""){
    			orderList('ZUBOUT','ZUB',orderNo,'','','','2',localStorage['site'],'','','');
    		}else if(localStorage['ibtSearchFlag'] == "false"){
    			console.log(localStorage['ibtSearchFlag']);
    			localStorage['ibtSearchFlag']='true';
        		console.log("No result found in first round");
        		orderViewSearch(orderNo);
    		}
    		else{
    			console.log("preq flag is set false,and no result is found and search flag is false.");
        		var j ='<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders found. Please refine your search by using advanced search.</div>';
            	t.html(j);
            	$(".overlay,.loader").fadeOut();
            	delete localStorage['ibtSearchFlag'];
            	console.log("ibtSearchFlag is being deleted",localStorage['ibtSearchFlag']);
    		}
    	}
    },function(err){
    	console.log('Error. ', err);
    	$('.loader').fadeOut();
    	$("#searchFailedPopup,.overlay").fadeIn();
		centerAlign("#searchFailedPopup");
    	
    });
}


function loadMoreOrderItems(order_no){
	$('.more-loader').hide();
	site=localStorage['site'];
	if(order_no == undefined){
		order_no ="";
	}
	track_no=localStorage['trackingOrderNo'];
	
	order_type = localStorage['orderTypeAdvSearch'];
	localStorage['orderType']=order_type;
	if((order_type == "default")){
		order_type = "";
	}
	else if(order_type == "ZUBOUT" || order_type == "ZUBIN"){
		order_type = "ZUB";
	}
	order_status= localStorage['searchorder_status'];
	if((order_status == "default")){
		order_status = "";
	}
	var fromdate= localStorage['searchfromDate'];
	if((fromdate != "default")&&(fromdate != "")  ){
		var tempFromDate=fromdate.split('-');
		delivery_fromdate=tempFromDate[0]+tempFromDate[1]+tempFromDate[2];
	}else{
		delivery_fromdate ='';
	}
	var todate=localStorage['searchtoDate'];
	if((todate != "default")&&(todate != "")){
		var tempToDate=todate.split('-');
		delivery_todate=tempToDate[0]+tempToDate[1]+tempToDate[2];
	}else{
		delivery_todate = '';	
	}
	console.log("delivery_fromdate ::--->"+delivery_fromdate +"   "+"delivery_todate:----->"+delivery_todate);
	var sos=localStorage['searchSource'];
	console.log(sos);
	if(sos=='direct-vendor'){
		sos='1';
		supplier=localStorage['orderSearch_VendorId'];
	}
	else{
		sos='';
		supplier ='';
	}
	
	var pageNo = parseInt(localStorage['pageNo']);
	var records = 10;
	
	orderList(site,order_type,order_no,order_status,delivery_fromdate,delivery_todate,sos,supplier,pageNo,records,track_no);
	
	
}
function onClickViewOrder(){
	 $('#viewOrder .levelThree').click(function(){
		 var orderStatus=$(this).find('#orderSts').text();
		 var orderTypeDesc=$(this).find('.orderTypeDescription').text();
		 var orderNo=$(this).find('.orderNo').text();
		 var supp_name=$(this).find('.suppName').text();
		 var total_cartons=$(this).find('.cartons-no-lukup-list').text();
		 /*hidden fields */
		 var sendingStore=$(this).find('.sendingStore').val();
		 var deliveryDate=$(this).find('.orderDeliveryDate').val();
		 var departmentNo=$(this).find('.departmentNo').val();
		 var orderType=$(this).find('.orderType').val().trim();
		 
		 /*saving variable in the localStorage*/
		 localStorage['orderStatus']=orderStatus;
		 localStorage['orderTypeDesc']=orderTypeDesc;
		 localStorage['orderNo']=orderNo;
		 localStorage['vendor_name']=supp_name;
		 localStorage['sendingStore']=sendingStore;
		 localStorage['total_cartons']=	total_cartons;
		 localStorage['deliveryDate']=deliveryDate;
		 localStorage['departmentNo']=departmentNo;
		 localStorage['orderType']=orderType;
		 localStorage['fromOrderlist']="false";
		 console.log('Clicked Item : Status - ', localStorage['orderStatus'], ' Type - ', localStorage['orderType'], ' Order Number : ', localStorage['orderNo']);
		 localStorage['pageId']='orderDetail';
		 console.log('To localStorage["pageId"] : ',  localStorage['pageId']);
		 window.location='orderDetail.html';
	 });
} 

function orderListStorage (order_no){
	$('.overlay, .loader').fadeIn(300);
	centerAlign('.loader');
	searchFlag=localStorage['fromAdvSearchPage'];
	if(order_no == "undefined" || order_no == ""){
		order_no="";
	}
	
	var order_type="";
	var order_status = "";
	var supplier="";
	var pageNo = 1;
	//var records = 10;
	var records='';
	var d=new Date();
	var currentDate =d.toISOString().slice(0,10).replace(/-/g,"");
	var delivery_todate =currentDate;
	var delivery_fromdate=currentDate;
	if(searchFlag == "true"){
		
		track_no=localStorage['trackingOrderNo'];
		
		var sos=localStorage['searchSource'];
		console.log(sos);
		if(sos == "warehouse"){
			sos='';
		}else if(sos=='direct-vendor'){
			sos='1';
			supplier=localStorage['orderSearch_VendorId'];
		}
		else if(sos=='undefined'){
			sos='';
			supplier ='';
		}
		order_type = localStorage['orderTypeAdvSearch'];
		localStorage['orderType']=order_type;
		if((order_type == "default")){
			order_type = "";
		}
		if((order_type == "ZUB")){
			order_type = "ZUB";
			sos ="2";
			supplier=site;
			site="ZUBALL";
		}
		if((order_type == "ZUBIN")){
			order_type = "ZUB";
			sos ="2";
		}
		if((order_type == "ZUBOUT")){
			order_type = "ZUB";
			sos ="2";
			supplier=site;
			site="ZUBOUT";
		}
		order_status= localStorage['searchorder_status'];
		
		if((order_status == "default")){
			order_status = "";
		}
		console.log('order_status : ', order_status);
		var fromdate= localStorage['searchfromDate'];
		if((fromdate != "default")&&(fromdate != "")  ){
			var tempFromDate=fromdate.split('-');
			delivery_fromdate=tempFromDate[0]+tempFromDate[1]+tempFromDate[2];
		}else{
			delivery_fromdate ='';
		}
		var todate=localStorage['searchtoDate'];
		if((todate != "default")&&(todate != "")){
			var tempToDate=todate.split('-');
			delivery_todate=tempToDate[0]+tempToDate[1]+tempToDate[2];
		}else{
			delivery_todate = '';	
		}
		console.log("delivery_fromdate ::--->"+delivery_fromdate +"   "+"delivery_todate:----->"+delivery_todate);
		
		
		
		console.log(sos, supplier);
		orderList(site,order_type,order_no,order_status,delivery_fromdate,delivery_todate,sos,supplier,pageNo,records,track_no);
	}else{
		console.log('site'+site,'order_type'+order_type,'delivery_todate',delivery_todate);
		orderSearchList(site,delivery_todate,delivery_fromdate);
	}
	
	
}

function orderViewSearch(orderNo){
	
	var order_status ="";
	var order_type="";
	var delivery_fromdate="";
	var delivery_todate ="";
	var sos="";
	var supplier="";
	var pageNo = 0;
	var records = 1;
	var track_no="";
	ibtSearchFlag=localStorage['ibtSearchFlag'];
	if((typeof ibtSearchFlag == "undefined") || ibtSearchFlag=="false"){
		console.log("ibtSearchFlag",ibtSearchFlag);
		orderList(site,order_type,orderNo,order_status,delivery_fromdate,delivery_todate,sos,supplier,pageNo,records,track_no);
	}
	else if(ibtSearchFlag == "true"){
		console.log("ibtSearchFlag is true",ibtSearchFlag);
		order_type="ZUB";
		var sos="2";
		var supplier=site;
		var pageNo = 0;
		var records = 10;
		//localStorage['ibtSearchFlag']='false';
		orderList(site,order_type,orderNo,order_status,delivery_fromdate,delivery_todate,sos,supplier,pageNo,records,track_no);
	}
	
}
		
function onSearch(productSearchInput){
	//localStorage.removeItem('lookupOrderInput');
	var t = $("#viewOrder-details");
	localStorage['barcodeScan']= "false";
	console.log('ProductSearchInput : ',productSearchInput);
	productSearchInput=productSearchInput.trim();
	if(productSearchInput!=""){
		$('.overlay, .loader').fadeIn(300);
		centerAlign('.loader');
		if ($.isNumeric(productSearchInput)){
			
			var searchTermLength=productSearchInput.length;
			console.log('isNumeric',searchTermLength);
			
			if(searchTermLength==4 || searchTermLength>6){
				console.log('==4 || >6');
				
				if(searchTermLength==4){
					console.log('==4');
					addItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
				}
				if(7<searchTermLength<11){
					
						console.log('order search');
					if (wool.tableExists("viewOrder")) {
						wool.dropTable("viewOrder");
			        	console.log('viewOrder table does not exist');
			            wool.createTable("viewOrder", ["Vendor", "OrderNo", "DeliveryDate", "CreationDate", "ReceivingStore", "SendingStore", "CartonsNo", "OrderType", "OrderTypeDescription", "OrderStatus","RosterDate","SupplierName"]);
			            console.log('viewOrder Table created');
			            console.log('calling orderViewSearch');
						t.empty();
						order_no=productSearchInput;
						orderViewSearch(order_no);
			        } else {
			        	console.log('calling populateViewOrderTable');
			            populateViewOrderTable();
			        }
					
					
				}
				/*for preq No*/
				
				if(searchTermLength >10){
					if (wool.tableExists("viewOrder")) {
						wool.dropTable("viewOrder");
			        	console.log('viewOrder table does not exist');
			            wool.createTable("viewOrder", ["Vendor", "OrderNo", "DeliveryDate", "CreationDate", "ReceivingStore", "SendingStore", "CartonsNo", "OrderType", "OrderTypeDescription", "OrderStatus","RosterDate","SupplierName"]);
			            console.log('viewOrder Table created');
			            console.log('calling orderListStorage');
						addItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
						console.log('>6',addItemUri);
						var Header = {
								headers : oHeaders, // object that contains HTTP headers as name value pairs
								requestUri : addItemUri, // OData endpoint URI
								method : "GET",
								
							};
							OData.request(Header,
								function (data, response){
									console.log("success");
									if(data.results[0]!= undefined) {
									console.log(data.results[0]);
									var article_no=data.results[0].article.replace(/^0+/, '');
									t.empty();
									order_no=article_no;
									localStorage['barcodeScan']= "true";
									orderViewSearch(order_no);
									}
									else{
										$("#searchFailedPopup,.overlay").fadeIn();
										centerAlign("#searchFailedPopup");
										$(".loader").fadeOut();
									}
							},
							function(err){
								$("#searchFailedPopup,.overlay").fadeIn();
								centerAlign("#searchFailedPopup");
								$(".loader").fadeOut();	
							});
			        } else {
			        	console.log('calling populateViewOrderTable');
			            populateViewOrderTable();
			        }
					
				}
			}else{
				localStorage['inputType']='article';
				addItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
			}
		}
	
	
}
	else{
		$('.overlay, #view-order-search').fadeIn();
		centerAlign('#view-order-search');
		
	}
}/*--------------------------  View Order  Service ends --------------------------*/
/*-------------------------- Order Details Service starts --------------------------*/ 
function orderListDetails(order_no,orderType){
	console.log("Ordr No:--->"+order_no);
	localStorage['AA_orderNo']=order_no;
	var preqFlag =localStorage['pReqFlag'];
	var order_type=orderType.trim();
	console.log("order_type:--->"+order_type);
	var order_status="";
	var delivery_fromdate="";
	var delivery_todate="";
	var sos="";
	var supplier="";
	if(preqFlag == "true"){
		delivery_fromdate="";
		delivery_todate="";
		updateUri =uriPrefix+"ZSP_PR_ENQ_ITEM/zsp_pr_enq_itemCollection?$filter=iv_site eq '"+site+"' and iv_preq_no eq '"+order_no+"'  and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"'";
	}
	else{
		if(order_type =="ZUB"){
		updateUri =uriPrefix+"ZSP_ORDER_ENQ_ITM/zsp_order_enq_itmCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+order_type+"' and iv_order_no eq '"+order_no+"' and iv_order_status eq '"+order_status+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"' and iv_sos eq '2' and iv_supplier eq '"+site+"'";
			}
	else{
		updateUri =uriPrefix+"ZSP_ORDER_ENQ_ITM/zsp_order_enq_itmCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+order_type+"' and iv_order_no eq '"+order_no+"' and iv_order_status eq '"+order_status+"' and iv_delivery_fromdate eq '"+delivery_fromdate+"' and iv_delivery_todate eq '"+delivery_todate+"' and iv_sos eq '"+sos+"' and iv_supplier eq '"+supplier+"'";
	}
	}
	console.log("updateUri:--------->"+updateUri); 
    var updateItemHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: updateUri, // OData endpoint URI
        method: "GET"
        
    };
    OData.request(updateItemHeader, 
    	function(data,response){
    		viewOrderDetailsPage(data);
    		$('.overlay, .loader').fadeOut(500);
	    },function(err){
	    	$('.loader').fadeOut();
	    	$('#cancel-order-status .head-title').text('Add Item');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('#cancel-order-status,.overlay').fadeOut();");
			$('#cancel-order-status, .overlay').fadeIn();
			centerAlign('#cancel-order-status');
	    }
    );
}


function viewOrderDetailsPage(data){
	//localStorage['OrdersFromHome']="false";
	
	var orderStatus=localStorage['orderStatus'];
	var preqFlag=localStorage['pReqFlag'];
	localStorage['articleData']=JSON.stringify(data);
	console.log("data.results.length:--",data.results.length);
	$(".totalArticle").text(data.results.length);
	if(data.results.length>0){
	var msg =data.results[0].msg;
	
	if(($.isNumeric(msg)) || msg==""){
		
		if(preqFlag =="false"){
			var docketNo = data.results[0].del_doc_no;
			var invoiceTotal=data.results[0].invoice_total;
			var invoiceNo=data.results[0].invoice_no;
			var gstTotal=data.results[0].gst_amount;
			localStorage['invoiceNo']=invoiceNo;
			localStorage['invoiceTotal']=invoiceTotal;
			localStorage['gst']=gstTotal;
			localStorage['docketNumber']=docketNo;
			var temp =data.results[0].temperature;
			localStorage['tempCheck']=temp;
			console.log("temp check field",temp);
		}
		
	for (var i = 0; i < data.results.length; i++) {
		var article_desc=data.results[i].article_desc;
		var item_no=data.results[i].item_no;
		var order_qty=data.results[i].order_qty;
		console.log('order_qty : ', order_qty);
		var article=data.results[i].article.replace(/^0+/, '');
		var order_multiple='';
		var received_qty='';
		var recCtnt = '';
		var packCtnt = '';
		var delDate='';
		var editDeldate='';
		var editableQdrQty='';
		var uom=data.results[i].uom;
		var temperature = data.results[i].temperature;
		localStorage['tempRange'] = temperature;
		console.log('temperature: ', temperature);
		/*if(temperature!='' && temperature!='undefined' && temperature!=undefined){
			var min_tmp = temperature.split('(')[1].split('to')[0];
			var max_tmp = temperature.split('to')[1].split(')')[0];
			console.log('min_tmp: ', min_tmp, 'max_tmp: ', max_tmp);
		}*/
		
		if(preqFlag =="true" && orderStatus == "Open"){
			console.log('PREQ');
		//Add article
			
		var preqNo=localStorage['AA_orderNo'];
		var articleNumber = data.results[i].article.replace(/^0+/, '');
		var desc=data.results[i].article_desc;
		var om=data.results[i].order_multiple;
		var baseQty= data.results[i].uom;
		var vendorName = data.results[i].supp_name;
		var vendorNo = data.results[i].supp_no;				
		var orderQty = data.results[i].order_qty;
		//var orderQty=data.results[i].tot_order_qty;
		var tradingDept = data.results[i].trading_dep_no;
		console.log('tradingDept : ', tradingDept);
		var rosterDate=data.results[i].date_created;
		var deliveryDate=data.results[i].delivery_date;
		var itemNo=data.results[i].item_no;
		var segmentNo=data.results[i].segment_no;
		console.log('Adding article to preq');
		
		addArticleToPreqList(preqNo, articleNumber, desc, om, baseQty, vendorName, vendorNo, itemNo, orderQty, tradingDept, rosterDate, deliveryDate, segmentNo);		
			if(i==data.results.length-1){
				/*left for preq*/
				delDate =data.results[i].delivery_date;
				recCtnt ='<span class="" >Delivery Date.:</span>'
					+'<input type="text" class="editInput editInputBorder editDelDate" disabled value="'+delDate+'" />';
				editDeldate='<tr><td colspan="2"><img src="../images/editButton.png"  class="editPr "> </td></tr>';
				editableQdrQty='<input type="number" disabled class="editInput editQrdQty editInputBorder" value="'+order_qty+'" />';
				console.log('Disp article to preq');
				populatePreqArticles();
			}
		}else{
			order_multiple=data.results[i].order_multiple;
			received_qty=data.results[i].received_qty;
			//console.log(item_no, article);
			console.log(order_qty);
			recCtnt ='<span class="green" >Received Qty :</span>'
				+'<span class="green" >'+received_qty+'</span>';
			/*if(preqFlag =="false"){
			recCtnt ='<span class="green" >Received Qty :</span>'
				+'<span class="green" >'+received_qty+'</span>';
			}else{
				recCtnt='';
			}*/
			
			packCtnt='<span class="right-align grey ">Pack Size '+order_multiple+'</span>';
			editableQdrQty='<span class="green" >'+order_qty+'</span>';
			var additem='<div class="levelThree height100">'
				+'<div class="levelOne">'
				+'<table class="order-lst-itm fontHel font14 ranged">'
				+'<tbody>'
				+'<tr>'
				+'<td>'
				+'<span class="item-desc-txt">Article &nbsp;#</span>'
				+'<span class="item-desc-val articleNo">'+article+'</span>'
				//+packCtnt
				+'</td>'
				+'</tr>'
				+'<tr>'
				+'<td colspan="2" class="item-desc-val description">'
				+'<div class="to-lookup-Div">'+article_desc+'</div>'
				+'<input type="hidden" class="uom" value="'+uom+'">'
				+'<input type="hidden" class="articleItemNo" value="'+item_no+'">'
				+'</td>'
				+'</tr>'
				+'<tr>'
				+'<td colspan="2" class="item-desc-txt" >'
				+'<span class="green" >Ordered Qty :</span>'
				+editableQdrQty
				+'&nbsp;</td></tr><tr><td>'
				+recCtnt
				+packCtnt
				+'</td>'
				+'</tr>'
				+editDeldate
				+'</tbody>'
				+'</table>'
				+'</div>'
				+'</div>';
			var t = $(".srch-rslt-list ");
			console.log(additem);
	        t.append(additem);
	        //refreshScroll();
	
		}
		
		
		
	}
	
	}
	else{
		$(".totalArticle").text('0');
		
	}}
	else{
		$(".totalArticle").text(data.results.length);
	/*	var t = $(".srch-rslt-list");
		t.append('<p>NO Data found</p>');*/
	}
	$(".deletePr").click(function(){
		  console.log("delete clicked");
		  console.log($(this));
		  var articlenNumber=$(this).parents('.levelThree').find('.articleNo').text();
		  $('#delete-item-popup .article-no').text(articlenNumber);
		  $('#delete-item-popup, .overlay').fadeIn();
		  centerAlign('#delete-item-popup');
	});
	$(".editPr").click(function(){
		  console.log("clicked");
		  var target = $('.editInput');
		  if($(this).find('.editPr').hasClass('editImgBtn')) {
			  $(this).find('.editPr').addClass('saveImgBtn');
			  $(this).find('.editPr').removeClass('editImgBtn');
			  var deliveryDateElement=$(this).parents('.levelThree').find('.editDelDate');
			  var delDate=deliveryDateElement.val();
			  var day=delDate.split(".")[0];
			  var month = delDate.split(".")[1];
			  var year = delDate.split(".")[2];
			  var dateFormatted = year + "-" + month + "-" + day;
			  deliveryDateElement.attr('type', 'date');
			  deliveryDateElement.attr("value", dateFormatted);
			  target.toggleDisabled();
		  	  target.toggleClass('editInputBorder');
		  }
		  else {
			  var date = new Date();
		      var day = date.getDate();
		      var month = date.getMonth() + 1;
		      var year = date.getFullYear();
		      if (month < 10) month = "0" + month;
		      if (day < 10) day = "0" + day;
		      var today = year + "-" + month + "-" + day;
			  var element=$(this).parents('.levelThree');
			  var newOrdQty=element.find('.editQrdQty').val();
			  var delDate=element.find('.editDelDate').val();
			  console.log(delDate);
			  console.log(today);
			  console.log(delDate>today);
			  console.log(newOrdQty);
		      if(newOrdQty.trim().length==0){
				errorOkPopup("Plese enter quantity",element.find('.editQrdQty'));
		      }else if(newOrdQty<=0){
				errorOkPopup("Quantity should not be zero or less than zero",element.find('.editQrdQty'));
			  }else if(newOrdQty % 1 != 0){
				errorOkPopup("Quantity should be a whole number",element.find('.editQrdQty'));
			  }else if(delDate.trim().length==0){
					errorOkPopup("Please select Delivery Date",element.find('.editDelDate'));
			  }else if(delDate<today){
					errorOkPopup("Delivery Date cannot be less than todays Date",element.find('.editDelDate'));
			  }else{
				  $(this).find('.editPr').removeClass('saveImgBtn');
				  $(this).find('.editPr').addClass('editImgBtn');
				  target.toggleDisabled();
				  //2013-09-20
				  var year=delDate.split("-")[0];
				  var month = delDate.split("-")[1];
				  var day = delDate.split("-")[2];
				  var dateFormatted = day + "." + month + "." + year;
				  console.log(dateFormatted);
				  $(this).parents('.levelThree').find('.editDelDate').attr('type', 'text');
				  $(this).parents('.levelThree').find('.editDelDate').val(dateFormatted);
			  	  target.toggleClass('editInputBorder');
			  }
		  }
	  	});
	refreshScroll();
}
/*--------------------------  Order Details service ends --------------------------*/


function lookupSearch(productSearchInput){
 	//var productSearchInput=$('#search-input').val();
 	//console.log();
 		if ($.isNumeric(productSearchInput) && (productSearchInput.length>6 || productSearchInput.length==4)){
 			$('.errMsg').hide();
 			$('.overlay, .loader').fadeIn(300);
 			centerAlign('.loader');
 			var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+productSearchInput+"' and iv_site eq '"+site+"'";
 			productLookup(productLookupUri);
 		}else{
 			$('#only-barcode-popup .popup-msg').text('Please enter a valid barcode number');
 			$('#only-barcode-popup, .overlay').fadeIn(300);
 			centerAlign('#only-barcode-popup');
 		}
}
 
function fillAdditionalDetails(){
	 //$('.overlay, .loader').fadeIn(300);
	 //centerAlign('.loader');
	console.log('In fillAddnlDetails');
	 $('#article-no').text(localStorage['articleNumber']);
	 $('#desc').text(localStorage['description']);
	 $('#cpu').text("$ "+localStorage['cpu']+" per "+localStorage['baseQty']);
	 $('#gross-profit').text(localStorage['grossProfit']+" %");
	 var sellPrice = localStorage['salesPrice'],
	 	 costPrice = localStorage['purchasePrice'],
	 	 gp = ((sellPrice - costPrice)/sellPrice)*100; 
	 console.log('sellPrice:', sellPrice, ' costPrice:', costPrice, ' gp:', gp ); 
	 $('#gp').text(gp+" %");
	 $('#ranged').text(localStorage['rangedFlag']);
	 /*$('#security-item').text(localStorage['securityItem']);*/
	 $('#srt').text(localStorage['srt']);
	 $('#trading-dept').text(localStorage['department']);
	 $('#coarse-dept').text(localStorage['category']);
	 $('#fine-dept').text(localStorage['subCategory']);
	 $('#subsection').text(localStorage['segment']);
	 $('#ean').text(localStorage['ean']);
	 $('#supplier').text(localStorage['supplierDesc']);
	 $('#gst-rate').text(localStorage['gst']+" %");
	 //$('#sell-price-group').text(localStorage['sellPriceGroup']);
	 $('#vendor-sku').text(localStorage['vendor']);
	 $('#perpetual').text(localStorage['perpetualFlag']);
	 $('#supply-type').text(localStorage['sourceOfSupply']);
	 
	 if(localStorage['sourceOfSupply']!='Vendor'){
		$('.order-footer-btn').hide();
		$('.cor-footer-btn').hide();
		document.getElementById('nearby-footer-btn').style.height='100%';
		document.getElementById('stock-footer-btn').style.height='100%';
		document.getElementById('footer-container').style.height='60px';
	 }
	 
	 var secItem = localStorage['securityItem'];
	 if (secItem == "Y") {
		 secItem = "Yes";
	 }
	 else if (secItem == "N") {
		 secItem = "No";
	 }
	 console.log("secItem", secItem);
	 $('#security-item').text(secItem);
	 var packBreakdownFlag=localStorage['packBreakdownFlag'];
	 console.log('PackBreakdownFlag : ', packBreakdownFlag);
	 if(packBreakdownFlag=='N'){
		 $('.pckBrkdwn-details').hide();
		 $('#pack-details-section').find('.divider-img').hide();
	 }
	 $('.overlay, .loader').fadeOut(500);
}
/*-------------------------- Product Lookup service ends --------------------------*/
 
/*-------------------------- Advanced Search - On Load service start --------------------------*/
 
function fillSelectField(code, id) {
	console.log(code, id);
	var salesOrg=localStorage['salesOrg'];
	if(code=="default"){
		console.log("IN DEF");
		if(id=="coarseDept"){
			$('.category').hide();
			$('.sub-category').hide();
			$('.segment').hide();
			$('#coarseDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#fineDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}else if(id=="fineDept"){
			$('.category').show();
			$('.sub-category').hide();
			$('.segment').hide();
			$('#fineDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}else if(id=="subsection"){
			$('.category').show();
			$('.sub-category').show();
			$('.segment').show();
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}else{
			$('.category').hide();
			$('.sub-category').hide();
			$('.segment').hide();
		}
		refreshScroll();
		$('.overlay, .loader').fadeOut();
	}
	else{
		if(id=="coarseDept"){
			$('.category').show();
			$('.sub-category').hide();
			$('.segment').hide();
		}else if(id=="fineDept"){
			$('.sub-category').show();
			$('.segment').hide();
		}else if(id=="subsection"){
			$('.segment').show();
		}else{
			$('.category').hide();
			$('.sub-category').hide();
			$('.segment').hide();
		}
		refreshScroll();
		console.log("IN");
		var getDepartmentsUri = uriPrefix+"ZSP_ARTICLE_HIERARCHY/zsp_article_hierarchyCollection?$filter=iv_s_org eq '"+salesOrg+"' and iv_parent_node eq '"+code+"' and iv_dc eq '10'";
		var getDepartmentsHeader = {
			headers : oHeaders, // object that contains HTTP headers as name value
								// pairs
			requestUri : getDepartmentsUri, // OData endpoint URI
			method : "GET",
			timeoutMS : 200000
		};
		OData.read(getDepartmentsHeader, 
			function(data, response) {
				console.log(getDepartmentsUri);
				console.log('Removing previous values.');
				var selectedField="#"+id;
				$(selectedField).children().remove().end().append('<option selected value="default">Select</option>');
				for (var i = 0; i < data.results.length; i++) {
					var value=data.results[i].node;
					var desc=toProperCase(data.results[i].node_desc);
					console.log('Selected Field : ', selectedField, ' Value : ', value, ' Desc : ', desc);
					$(selectedField).append($('<option>', { 
				        value: value,
				        text : desc 
				    }));
					$('.overlay, .loader').fadeOut();
			     }	
			}, function(err) {
				$('.overlay, .loader').fadeOut(300);
				/*var selectedField="#"+id;
				var value='default';
				var desc='Server Error';
				$(selectedField).append($('<option>', { 
			        value: value,
			        text : desc 
			    }));*/
				$('#errNoResponse').show();
		});
	}
	
}

function selectSource(source){
	/*if(source=='all'){
		$('#sourceSearch').attr("disabled", "disabled").val(''); 
		$('#sourceSearch').attr("placeholder", "Select source of supply");
		$('#vendor').attr("disabled", "disabled");
		$('#vendor').children().remove().end().append('<option selected value="default">Select supplier</option>'); 
	}else */if(source=='warehouse'){
		$('#advancedSearch #sourceSearch').attr("placeholder", "Enter partial/ complete warehouse no or name.").val('').removeAttr("disabled").focus();
		$('#advancedSearch #vendor').attr("disabled", "disabled");
		$('#advancedSearch #vendor').children().remove().end().append('<option selected value="default">Select supplier</option>');
	}else if(source=='direct-vendor'){
		$('#advancedSearch #sourceSearch').attr("placeholder", "Enter partial/ complete vendor name.").val('').removeAttr("disabled").focus();;
		$('#advancedSearch #vendor').attr("disabled", "disabled");
		$('#advancedSearch #vendor').children().remove().end().append('<option selected value="default">Select supplier</option>');
	}
}

function populateVendors(){
	if($('#sourceSearch').val()!=''){
		$('.overlay, .loader').fadeIn(500);
		centerAlign('.loader');
		var sourceOfSupply=$("input:radio[name=sourceOfSupply]:checked").val();
		console.log('sourceOfSupply : ', sourceOfSupply);
		if(sourceOfSupply=='direct-vendor'){
			var supplierType=$("input:radio[name=sourceOfSupply]:checked").parent().find('label').text().trim();
			if(supplierType=='Vendor'){
				var vendor=$('#sourceSearch').val();
				if ($.isNumeric(vendor)){
					getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_no eq '"+vendor+"' and iv_site eq '"+site+"'";
				}else{
					getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_name eq '*"+encodeURIComponent(vendor)+"*' and iv_site eq '"+site+"'";
				}
				getSuppliers(getSuppliersUri, 'vendor');
			}else if(supplierType=='Store'){
				var store=$('#sourceSearch').val();
				if ($.isNumeric(store)){
					getSuppliersUri= uriPrefix+"ZSP_STORE_LOOKUP/zsp_store_lookupCollection?$filter=iv_site_no eq '"+store+"'";
				 }else{
					 getSuppliersUri=uriPrefix+"ZSP_STORE_LOOKUP/zsp_store_lookupCollection?$filter=iv_site_name eq '*"+encodeURIComponent(store)+"*'";
				 }
				getSuppliers(getSuppliersUri, 'store');
			}
		}else if(sourceOfSupply=='warehouse'){
			var warehouse=$('#sourceSearch').val();
			if ($.isNumeric(warehouse)){
				getSuppliersUri=uriPrefix+"ZSP_WAREHOUSE_LOOKUP/zsp_warehouse_lookupCollection?$filter=iv_site_no eq '"+warehouse+"' and iv_site eq '"+site+"'";
			}else{
				getSuppliersUri=uriPrefix+"ZSP_WAREHOUSE_LOOKUP/zsp_warehouse_lookupCollection?$filter=iv_site_name eq '*"+encodeURIComponent(warehouse)+"*' and iv_site eq '"+site+"'";
			}
			getSuppliers(getSuppliersUri, 'warehouse');
		}
	}
}

function getSuppliers(getSuppliersUri, sourceOfSupply){
	var getDepartmentsHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value
							// pairs
		requestUri : getSuppliersUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	};
	OData.read(getDepartmentsHeader, 
		function(data, response) {
			$('#vendor').children().remove().end().append('<option selected value="default">Select supplier</option>');
			var numberOfSuppliers=data.results.length;
			console.log('URI : ',getSuppliersUri, ' Response Length : ', data.results.length);
			if(numberOfSuppliers>1){
				for (var i = 0; i < data.results.length; i++) {
					var supplierNumber='';
					var supplierName='';
					if(sourceOfSupply=='vendor'){
						supplierNumber=data.results[i].vendor_no;
						supplierName=toProperCase(data.results[i].vendor_name);
					}else if(sourceOfSupply=='warehouse' || sourceOfSupply=='store'){
						supplierNumber=data.results[i].site_no;
						supplierName=toProperCase(data.results[i].site_name);
					}
					console.log('Number : ', supplierNumber, ' Name : ', supplierName);
					$('#vendor').append($('<option>', { 
				        value: supplierNumber,
				        text : supplierNumber+" | "+supplierName
				    }));
					$('#vendor').removeAttr("disabled");
					$('.overlay, .loader').fadeOut(300);
			     }
			}else if(numberOfSuppliers==1){
				var supplierNumber='';
				var supplierName='';
				if(sourceOfSupply=='vendor'){
					supplierNumber=data.results[0].vendor_no;
					supplierName=toProperCase(data.results[0].vendor_name);
				}else if(sourceOfSupply=='warehouse' || sourceOfSupply=='store'){
					supplierNumber=data.results[0].site_no;
					supplierName=toProperCase(data.results[0].site_name);
				}
				console.log('Number : ', supplierNumber, ' Name : ', supplierName);
				$('#vendor').append($('<option>', { 
			        value: supplierNumber,
			        text : supplierNumber+" | "+supplierName
			    }));
				$('#vendor').removeAttr("disabled");
				$('.overlay, .loader').fadeOut(300);
			}else{
				console.log(data.results);
				$('#vendor').attr("disabled", 'disabled');
				var errMsg='<option selected value="default">Enter valid '+sourceOfSupply+'</option>';
				$('#vendor').children().remove().end().append(errMsg);
				$('.overlay, .loader').fadeOut(300);
			}
		}, function(err) {
			$('#vendor').attr("disabled", 'disabled');
			var errMsg='<option selected value="default">Server Error</option>';
			$('#vendor').children().remove().end().append(errMsg);
			$('.overlay, .loader').fadeOut(300);
			$('#errNoResponse').show();
		});
}

/*-------------------------- Advanced Search - On Load service end --------------------------*/

//Bind click event in lookupList items and go to stockAdjust
function clickStockAdjust(){
	 $('.lukup-lst-itm').click(function(){
		var rangedFlag= $(this).hasClass('ranged');
		var stockFlag=$(this).find('.ranged-box').length;
		if(rangedFlag || (!rangedFlag && stockFlag>0)){
			itemNo_SA=$(this).find('.articleNo').text();
			localStorage['typeOfInput']='article';
			//var productLookupUri=uriPrefix+"ZSP_ART_SEARCH_M_LIST/zsp_art_search_m_listCollection?$filter=iv_article  eq '"+itemNo_SA+"' and iv_site eq '"+site+"'";
			var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+itemNo_SA+"' and iv_site eq '"+site+"'";
			$('.overlay, .loader').fadeIn(300);
			centerAlign('.loader');
			productLookup(productLookupUri);
		}else{
			$('#not-ranged-popup, .overlay').fadeIn();
			centerAlign('#not-ranged-popup');
		}

	});
}
 
function refreshScroll(){
	setTimeout(function () {
		myScroll.refresh();
	}, 400);
}

//called from receiveOrderDetails page for Enabling or Disabling footer button
/*function enableButton(opt){
   switch (opt) {
   		case 'authorised':
   			disableUpdateOrder();
   			break;

   		case 'received':
			disableCancelOrder();
			break;

   		case 'cancelled':
   			disableReceiveOrder();
   			disableUpdateOrder();
   			break;

   		case 'open':
   			disableReceiveOrder();
   			break;
   			
   		case 'rejected':
   			disableReceiveOrder();
   			disableUpdateOrder();
   			disableCancelOrder();
			break;
			
   		case 'pending confirmation':
   			disableReceiveOrder();
   			disableUpdateOrder();
   			break;
   }
}
*/
//called from viewOrderDetails page for showing Received Qty
function receivedQty(){
	$('#actions-drop').hide();
	var size = $('.ordered-qty').length;
	for(var i=0;i<size;i++){
		var rec= $('.received-qty').eq(i).val();
		if(rec === "0"){
			var orderedQty = $('.ordered-qty').eq(i).text();
			var rec=$('.received-qty').eq(i).val();
			console.log(orderedQty+rec );
			$('.received-qty').eq(i).val(orderedQty);
			$('.received-qty').eq(i).val(orderedQty);
		}else{
			console.log("not equal");
		}
	}
}

//called from viewOrderDetails page for validating whether temperature is required.
function tempRequired(){
	 return $('#viewOrderDetails .temperature').attr('data-req');
}

//called from viewOrderDetails page for editing received quanity field
function editReceivedQty(){
	var table = $(this).closest('table');
	table.find('.received-qty').removeAttr('readonly');
}

function moveToReceived(table){
	/*var flag = localStorage['tableFlag'];
	console.log("FLag in moveToReceived function:---->",flag);*/
/*	if(flag=="true"){*/
		console.log('In moveToReceived');
		table.removeClass('not-received').addClass('received');
		table.find('.item-status').val('Received');
		table.find('.focus').attr('readonly','readonly');
		table.find('.hiddenButtons').addClass('hide');
		table.css("border-bottom","1px solid #9B9B9B");
		table.find('.confirm-btn').removeClass('confirmBind');
		localStorage['tableFlag']="false";
		confirmReceivedQty(table);
	/*}else{
	 	$('.overlay,.loader').fadeOut();
	}*/
}

function confirmReceivedQty(table){
	console.log('In confirmReceivedQty');
	var orderedQty = table.find('.ordered-qty').text().trim();
	var receivedQty = table.find('.received-qty').val().trim();
	table.fadeOut(500);
	if(orderedQty===receivedQty){
		y=table.clone();
		$('.received-items').append(y);
		table.remove();
	}else{
		y=table.clone();
		$('.received-items').prepend(y);
		table.remove();
	}
	$('.overlay, .loader').fadeOut();
	refreshScroll(); 
}
	 
function hiddenBtns(){
	console.log('In hiddenBtns');
    $('.update-btn').one('click', function () {
    	console.log('In update button');
     	var table = $(this).parent().parent().prev();
        table.find('.focus').removeAttr('readonly').focus();
        /*localStorage['tableFlag']= "true";
        var flag =localStorage['tableFlag'];
        console.log("Flag in update button",flag);*/
    });
    $('.confirmBind').one('click',function (e) {
    	console.log('In confirm button');
 	    var tab =  $(this).closest(".new");
 	    var table = $(this).parent().parent().prev();
 	    table.find('.focus').removeAttr('readonly').blur();
 	    var receivedQuantity=table.find('.received-qty').val().trim();
 	    var orderedQuantity=table.find('.ordered-qty').text().trim();
 	    console.log('receivedQuantity : ', receivedQuantity, 'orderedQuantity', orderedQuantity);
	    if(orderedQuantity == ""){
	    	orderedQuantity=receivedQuantity;
	    	table.find('.ordered-qty').text(receivedQuantity);
	    }
	    if(orderedQuantity===receivedQuantity){
	    	console.log('In equals');
	    	moveToReceived(tab);
	    }else{
	    	console.log('In not equals');
	    	$('.overlay').fadeIn();
	    	$('#back-popup').fadeIn();
	    	centerAlign('#back-popup');
	    	$('#back-popup #OK').one('click',function(e){
	    		console.log('Inside ok backpopup');
	 	   		moveToReceived(tab);
	 	   		$('#back-popup').fadeOut(500);
	 	   		return false;
	    	});
	    }
	    return false;
	});
}

 function finaliseOrder(){
	 /*If Finalise Order(FC) is initiated before all items have been received present,
	 the user with a pop up message Not all items received Present the below options 
	 -Review remaining items
	 -Receive remaining items with zero QTY
	 With option to select OK or Cancel*/
	 if($('.not-received').length!=0){
		 $('#finalise-popup').fadeIn(500);
		 $('#overlay').fadeIn(500);
		 centerAlign('#finalise-popup');
	 }
	 //2. update order status to Fully Received
	 $('.order-status').val('Fully Received');
	 //4. Flag each item in the order as received.
	 $('.item-status').val('Received');
}

//called from viewOrderDetails page for showing "Confirm" and "Update" buttons
function showButtons(){
	 $(this).find('.buttons').show('slow');
	 refreshScroll();
}

function disableUpdateOrder(){
   $('#updateOrder').attr('disabled','disabled').addClass('disabledBtn');
}

function disableCancelOrder(){
   $('#cancelOrder').attr('disabled','disabled').addClass('disabledBtn');
}

function disableReceiveOrder(){
   $('#receiveOrder').attr('disabled','disabled').addClass('disabledBtn');
}

function disableUpdateOrder(){
   $('#updateOrder').attr('disabled','disabled').addClass('disabledBtn');
}

//temporary function to pass selected option via URL
function redirectReceiveOrder(){
	 var selected = $('.orderStatus').val();
	 localStorage["pageId"] = 'receiveOrder';
	 window.location = 'receiveOrder.html?'+ 'orderStatus='+ selected;
}

//from lookup screen to LookupList
function passUrlValue(target){
	var presentValue = window.location.href.split('?')[1];
	localStorage['pageId']=target;
	window.location= target +'?'+ presentValue;
}

//validating if the user has searched the item
function checkSearched(){
	var href = window.location.href;
	if(href.indexOf('?') != -1){
	 	var num = window.location.href.split('?')[1].split('=')[1].split(':')[0];
	 	if(localStorage['searchTerm']=="undefined")
	 		$('#lookupList #search-input').val(num);
	 	else
	 		$('#lookupList #search-input').val(localStorage['searchTerm']);
	 		populateSearchResults(localStorage['searchTerm']);
	 }
}

function backPopup(id){
	var target='';
	if(localStorage['SA_fromHome']=='true'){
		target="WoWHome.html";
	}else{
		//localStorage['fromXtoDetails']='LookupList';
		target="LookupDetails.html";
	}
	$('#back-popup').fadeOut(500);
	$('.overlay').fadeOut(500);
	var presentValue = window.location.href.split('?')[1].split(':')[0];
	localStorage['pageId']=target;
	if(id=="clear"){
		clearItems();
		window.location= target +'?'+ presentValue;
	}else if(id=="finalize"){
		callFinalize();
	}else if(id=="back"){
		clearItems();
		window.location= target +'?'+ presentValue;
	}else
		window.location= target +'?'+ presentValue;
}
 
function closePopup(id){
	$(id).fadeOut(500);
	$('.overlay').fadeOut(500);
	if(id=="#success-popup"){
		clearItems();
		window.location.reload();
	 }
}

// For stock adjust screen
function validateFields(){
	 $('.reason-code').next().hide();
	 var opt = $('.reason-code').find(':selected').val();
	 if(opt=='default'){
		 $('.reason-code').focus();
		 $('.reason-code').next().show();
		 return false;
	 }
	 else{
		 $('#confirm-popup,#overlay-back').fadeIn(500);
		 centerAlign('#confirm-popup');
	 }
}

function confirmBack()
{
	if(localStorage.flag=="true"){
		$('#back-popup,#overlay-back').fadeIn(500);
		centerAlign('#back-popup');
	}else
		backPopup('cancel');
}

// Align element to the center of the page
function centerAlign(elem) {
		var topPos = $(window).height()/2 - $(elem).height()/2;
		var leftPos = $(window).width()/2 - $(elem).width()/2;
		$(elem).css({top:topPos,left:leftPos, position:'absolute'});
 }

//viewOrderDetails - Finalise option action
function finaliseAction(){
	 $('#finalise-popup .errMsg').fadeOut();
	 var checked = $('input[name="finalise-group"]:checked');
	 if(checked.length==0){
		$('#finalise-popup .errMsg').fadeIn(); 
		centerAlign('#finalise-popup');
	 }else{
		 	if(checked.val()=='receive-zero'){
		 		//update the received QTY of the un-received items to zero
		 		$('.not-received .received-qty').val('0');
		 		//Update Order Status to Fully Received
		 		$('#orderStatus').val('Fully Received');
		 		//Flag all items within order as Œeceived
		 		$('.item-status').val('Received');
		 		//Move it to Rceived Block
		 	}
		 	closePopup('#finalise-popup');
	 }
 }
 
function validateAdjusments() {
	$('#overlay, .loader').fadeIn();
	centerAlign('.loader');
	console.log('validateAdjusments');
	var adjThreshold = 20;
	if($('.reason-code option:selected').val()=="default"){
		errorOkPopup("You must select a reason prior to adjustment",".reason-code");
	}else {
		//var soh=$('#soh').text();
		var newSOH = $('.new-soh').val();
		var adjust = $('.adjust').val();
		if($.trim(newSOH).length == 0){
			errorOkPopup("Please Enter a value",".new-soh");
		}else if(Number(adjust) == 0){
			errorOkPopup("Please edit SOH to continue",".new-soh");
		}else{
			/*if(Number(newSOH)<0){
				errorOkPopup("Negative Stock on Hand Values are not permitted",".new-soh");
			}else {*/
				localStorage['SA_reason']=$('.reason-code option:selected').val();
				localStorage['SA_adjustment']=adjust;
				$('.loader').fadeOut();
				var adjust = Math.abs($('.adjust').val());
				console.log('Adjust : ', adjust, ' UserAction : ', userAction);
				if(adjust>adjThreshold && userAction!='Done'){
					console.log('AdjThreshold 	fade in');
					setTimeout(function() {
						$('#adjThreshold-popup .threshold-value').text(adjThreshold);
						$('#adjThreshold-popup, #overlay').fadeIn(300);
						centerAlign('#adjThreshold-popup');
					},1000);
				}else {
					//This must be final validation always. 
					//We are calling doAdjustment() from #noDecimal-popup button click
					if(isDecimalRequ){
						var hasDecimal = $('.new-soh').val()%1;
						if(hasDecimal==0){ //Doesnot have decimal
							$('.new-soh, .adjust').blur();
							$('.loader').fadeOut();
							setTimeout(function() {
								$('#noDecimal-popup, #overlay').fadeIn(300);
								centerAlign('#noDecimal-popup');
							},1000);
						}else{
							console.log('Calling doAdj 1');
							doAdjustment();
							//doStockAdjustment();
						}
					}else {
						console.log('Calling doAdj 2');
						doAdjustment();
						//doStockAdjustment();
					}
				}
			//}
		 }
	 }
 }

function doAdjustment(){
	console.log('In doAdj');
	var select = $('.reason-code option:selected').attr('reason-code');
	var indicator = $('.reason-code option:selected').attr('indicator');
	var soh = Number($('.soh').text());
	var newSOH = Number($('.new-soh').val());

	if(select=="252" || indicator=='S'){ //Plus adj qty
		
		//$('#signIndicator').text('(+)jk');
		if(newSOH<soh){
			errorOkPopup("New SOH value should be greater than current SOH value",".new-soh");
		}else{
			doStockAdjustment();
		}
	}else{ //Minus adj qty
		//$('#signIndicator').text('(-)');
		if(soh<newSOH){
			errorOkPopup("New SOH value should NOT be greater than current SOH value",".new-soh");
		}else{
			doStockAdjustment();
		}
	}
}

function doStockAdjustment(){
	console.log('VALID INPUTS!! STOCK ADJ CAN BE DONE!!!');
	$('.overlay, .loader').fadeIn();
	var itemNumber = $('#articleNumber').text();
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
	var currentDay=('0' + currentDate.getDate()).slice(-2);
	var docDate=currentYear+currentMonth+currentDay;
	var movementType=$(".reason-code option:selected").attr('reason-code');
	//var soh=$('.new-soh').val();
	var adjustment=String(Math.abs($('.adjust').val()));
	var uom=$('.uom').text();
	var inputData = {
		IV_SITE : site, 
	    IV_ARTICLE : itemNumber,
	    IV_DOC_DATE : docDate,
	    IV_MVMT_TYPE : movementType,
	    IV_QTY : adjustment,
	    IV_UOM : uom,
	    IV_TEST : ''			
	};
	getStockAdjustToken(inputData);
}

function getStockAdjustToken(inputData){
	var getStockAdjustUri = uriPrefix+"ZSP_STOCK_ADJ/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getStockAdjustHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getStockAdjustUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getStockAdjustHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			stockAdjust(header_xcsrf_token, inputData);
		},function(err) {
			$('.loader').fadeOut();
			console.log("Error! No response received.");
			$('#http-error-popup .popup-msg').text('Server not responding');
			$('#http-error-popup, .overlay').fadeIn();
			centerAlign('#http-error-popup');
		}
	);    
}
 
function stockAdjust(header_xcsrf_token, inputData){
	var newSoh=$('.new-soh').val();
	var stockAdjustUri=uriPrefix+"ZSP_STOCK_ADJ/StockAdjustments";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	var stockAdjustHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : stockAdjustUri, // OData endpoint URI
		method : "POST",
		data : inputData
	};
	OData.request(stockAdjustHeader,
		function (data, response){
		console.log("success");
			flag=true;
			console.log(data);
			console.log(response);
			console.log(response.statusCode);
			console.log(response.statusText);
			var jsonResponse=JSON.stringify(response);
			var msg=JSON.parse(jsonResponse).data.IV_MSG;
			console.log('MSG : ', msg);
			if(response.statusCode!="201" || msg.trim().length>2){
				$('.loader').fadeOut(300);
				$('#http-error-popup .popup-msg').text('Stock adjustment update failed in SAP - '+msg);
				$('#http-error-popup, .overlay').fadeIn(300);
				centerAlign('#http-error-popup');
			}else{
				if(localStorage['fromHomeToStock']!='undefined' && localStorage['fromHomeToStock']=='true'){
					$('#new-soh-value').text(newSoh);
					$('.loader').fadeOut(300);
					$('#exit-popup #popup-msg').show();
					$('#exit-popup #error-popup-msg').hide();
					$('#exit-popup, .overlay').fadeIn(300);
					centerAlign('#exit-popup');
				}else{
					checkFlow();
				}
			}
		},function(err) {
			$('.loader').fadeOut(300);
			$('#http-error-popup .popup-msg').text('Server not responding');
			$('#http-error-popup, .overlay').fadeIn(300);
			centerAlign('#http-error-popup');
			console.log("Error! No response received.", err.message);
		}
	);
}

function calculateAdjustment() {
	var soh = Number($('.soh').text());
	var newSOH = Number($('.new-soh').val());
	var adjust;
	adjust = ((newSOH*sohMultiplier) - (soh*sohMultiplier)) / sohMultiplier;
	adjust = Math.abs(Number(adjust.toFixed(3)));
	$('.adjust').val(adjust);
}

function calculateNewSoh(){
	var soh = Number($('.soh').text()), newSOH;
	var adjust = Number($('.adjust').val());
	newSOH = ((adjust*sohMultiplier) + (soh*sohMultiplier)) / sohMultiplier;
	var select = $('.reason-code option:selected').attr('reason-code');
	var indicator = $('.reason-code option:selected').attr('indicator');
	if(select=="252" || indicator=='S'){ //Plus adj qty
		newSOH=soh+adjust;
	}else{
		newSOH=soh-adjust;
	}
	newSOH = Number(newSOH.toFixed(3));
	$('.new-soh').val(newSOH);
}
 
//Stock Adjust screen
function checkSelectField(){
	if($('.reason-code option:selected').val()=="default"){
		errorOkPopup("You must select a reason prior to adjustment",".reason-code");
	}
}

function focusTo(id){
	$(id).focus();
}

function errorOkPopup(message,focus){
	$('.loader').fadeOut();
	$('#error-popup .popup-msg').text(message);
	$('#error-popup .popup-btns .ok').click(function(){
		focusTo(focus);
	});
	$('#error-popup, .overlay').fadeIn(300);
	centerAlign('#error-popup');
}

//allow only numbers and '-' symbol :charCode=45. no decimals
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && (charCode!=45) ) {
    	errorOkPopup('Decimals not permitted for non-weighted items','.new-soh');
        return false;
    }
    return true;
}

function gotoAddictionInfo(){
	//var articleNumber = localStorage.articleNumber;
	var pageId=$('#pageId').val();
	var articleNumber;
	if(pageId=="LookUpDetails")
		articleNumber = $('#articleNumber').text();
	else
		articleNumber = $('#articleNumber').val();
	localStorage['typeOfInput']='article';
	localStorage['pageId']='LookupDetails';
	window.location= 'LookupDetails.html?'+ 'articleNumber='+ articleNumber;
}

function gotoPackBreakdown(){
	 var articleNumber = $('#articleNumber').text();
	 localStorage['pageId']='PackBreak';
	 window.location= 'PackBreak.html?'+ 'articleNumber='+ articleNumber;
}

function gotoGtinPlu(){
	 var articleNumber =$('#articleNumber').text();
	 localStorage['pageId']='GtinPlu';
	 window.location= 'GtinPlu.html?'+ 'articleNumber='+ articleNumber;
}

function gotoCreateOrder(){
	var articleNumber=$('#articleNumber').text();
	var description=$('#description').text();
	var stockOnHand=$('#stockOnHand').text();
	var orderMultiple=$('#orderMultiple').text();
	var supplierType=$('#supply-type').text();
	var supplier;
	localStorage["fromLookUpDetails"]=articleNumber+" | "+description+" | "+stockOnHand+" | "+orderMultiple;
	localStorage["fromLookUpDetails_displayed"]='no';
	if(supplierType=='Vendor'){
		supplier=$('#supplyNo').text()+" | "+$('#supplyName').text();
		localStorage['fromLookUpDetails_SOS']=supplier;
		localStorage['pageId']='createPreq';
		window.location="createPreq.html";
	}else if(supplierType=='Warehouse'){
		var supplier=$('#supplyNo').text();
		localStorage['fromLookUpDetails_SOS']=supplier;
		localStorage['pageId']='createOrder';
		window.location="createOrder.html";
	}
}

function gotoCreateOrderOnReceipt(){
	var articleNumber=$('#articleNumber').text();
	var description=$('#description').text();
	var stockOnHand=$('#stockOnHand').text();
	var orderMultiple=$('#orderMultiple').text();
	var supplierType=$('#supply-type').text();
	var supplier;
	localStorage["fromLookUpDetails"]=articleNumber+" | "+description+" | "+stockOnHand+" | "+orderMultiple;
	localStorage["fromLookUpDetails_displayed"]='no';
	if(supplierType=='Vendor'){
		supplier=$('#supplyNo').text()+" | "+$('#supplyName').text();
		localStorage['fromLookUpDetails_SOS']=supplier;
		localStorage['pageId']='createOrderOnReceipt';
		window.location="createOrderOnReceipt.html";
	}else if(supplierType=='Warehouse'){
		var supplier=$('#supplyNo').text();
		localStorage['fromLookUpDetails_SOS']=supplier;
		localStorage['pageId']='createOrderOnReceipt';
		window.location="createOrderOnReceipt.html";
	}
}
/*-------------------------- GTIN/PLU Service starts --------------------------*/
function gtinLoad(articleNumber, type){
	$('.overlay, .loader').fadeIn(500);
	centerAlign('.loader');
	var targetList='';
	if(type=='TUN'){
		targetList=$('.tun-list');
		$('.ean-list').hide();
		$('.tun-list').show();
		$('.tun-list').html('');
		$('.greenSep-left').css('visibility', 'visible');
		$('.greenSep-right').css('visibility', 'hidden');
	}else if(type=='EAN'){
		$('.greenSep-left').css('visibility', 'hidden');
		$('.greenSep-right').css('visibility', 'visible');
		$('.tun-list').hide();
		$('.ean-list').show();
		$('.ean-list').html('');
		targetList=$('.ean-list');
	}
	var gtinUri=uriPrefix+"ZSP_ARTICLE_EAN/zsp_article_eanCollection?$filter=iv_article eq '"+ articleNumber+"'";
	console.log('gtinUri : ', gtinUri);
	var gtinHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : gtinUri, // OData endpoint URI 
		method : "GET"
	};
	OData.read(gtinHeader,
		function (data, response){
			var resultLength=data.results.length;
			if(resultLength==0){
				var tableRow = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No items to display</div>';
				targetList.append(tableRow);
			}else{
				if(type=='TUN'){
					for (var i = 0; i < data.results.length; i++) {
						//var mainEan=data.results[i].main_ean;
						var mainTun=data.results[i].main_tun;
						var altTun=data.results[i].alt_tun;
						if(mainTun=='X' || altTun=='X'){
							var baseUOM = data.results[i].base_uom;
							if( baseUOM == "Y" ){
								baseUOM = "Yes";
							}
							else if( baseUOM == "N" ) {
								baseUOM = "No";
							}
							var tableRow = '<div class= "gtinAppend">'
								+'<table id="item-table" class="gtinTable font14 fullWidth borderSep adj-list-table">'
								+'<tbody>'
								+'<tr>'
								+'<td class="width25">TUN </td>'
								+'<td class = "dark-green">'+data.results[i].ean11+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="bold width25">UOM:</td>'
								+'<td class = "bold dark-green">'/*+data.results[i].alt_uom+' | '*/+data.results[i].alt_uom_desc+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="width25">Base UOM:</td>'
								+'<td class = "dark-green">'+baseUOM+'</td>'
								+'</tr>'
								+'</tbody>'
								+'</table>'
								+'</div>';
							targetList.append(tableRow);
						}
					}
				}else if(type=='EAN'){
					for (var i = 0; i < data.results.length; i++) {
						var mainEan=data.results[i].main_ean;
						var mainTun=data.results[i].main_tun;
						var altTun=data.results[i].alt_tun;
						if(mainEan=='X' && !(mainTun=='X' || altTun=='X')){
							var tableRow = '<div class= "gtinAppend">'
								+'<table id="item-table" class="gtinTable font14 fullWidth borderSep adj-list-table">'
								+'<tbody>'
								+'<tr>'
								+'<td class="width25">EAN </td>'
								+'<td class = "dark-green">'+data.results[i].ean11+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="bold width25">Alt. UOM:</td>'
								+'<td class = "bold dark-green">'+data.results[i].alt_uom+' | '+data.results[i].alt_uom_desc+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="width25">Base UOM:</td>'
								+'<td class = "dark-green">'+data.results[i].base_uom+'</td>'
								+'</tr>'
								+'</tbody>'
								+'</table>'
								+'</div>';
							targetList.append(tableRow);
						}
					}
				}
			}
			$('.overlay, .loader').fadeOut(300);
		},
		function(err){
			$('#item-table').hide();
			var tableRow = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Server not responding</div>';
			$('.adjustments-block').append(tableRow);
			console.log("Site View - No response received!");
			$('.overlay, .loader').fadeOut(300);
		}
	);
}
/*-------------------------- GTIN/PLU Service ends --------------------------*/
/*-------------------------- Pack Breakdown Service starts --------------------------*/
function loadPackBreakdown(articleNumber, site){
	//var gtinUri=directUriPrefix+"ZSP_PACK_BREAKDOWN/zsp_pack_breakdownCollection?$filter=iv_article eq '"+articleNumber+"'";
	var packBreakdownUri=uriPrefix+"ZSP_PACK_BREAKDOWN/zsp_pack_breakdownCollection?$filter=iv_article eq '"+articleNumber+"'";
	var packBreakdownHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : packBreakdownUri, // OData endpoint URI 
		method : "GET"
	};
	OData.read(packBreakdownHeader,
		function (data, response){
			var resultLength=data.results.length;
			console.log("Sale view Length",resultLength);
			if(resultLength==0){
				$('#item-table').hide();
				var tableRow = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No items to display</div>';
				$('.adjustments-block').append(tableRow);
			}else{
				$('#item-table').show();
			}
			for (var i = 0; i < data.results.length; i++) {
				console.log(data.results);
				var breakdown = data.results[i].breakdown;
				var scan_desc = data.results[i].scan_desc;
				var description = data.results[i].description;
				var tableRow = '<div class= "pckAppend">'
								+'<table id="item-table" class="pckTable font14 fullWidth borderSep adj-list-table">'
								+'<tbody>'
								+'<tr>'
								+'<td class="width40">Breakdown Article </td>'
								+'<td class = "dark-green">'+breakdown+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="bold width40">Scan Description</td>'
								+'<td class = "bold dark-green">'+scan_desc+'</td>'
								+'</tr>'
								+'<tr>'
								+'<td class="width40">Description</td>'
								+'<td class = "dark-green">'+description+'</td>'
								+'</tr>'
								+'</tbody>'
								+'</table>'
								+'</div>';
				$('.adjustments-block').append(tableRow);
			}
			$('.overlay, .loader').fadeOut(300);
		},function(err){
			$('#item-table').hide();
			var tableRow = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Server not responding</div>';
			$('.adjustments-block').append(tableRow);
			console.log("Site View - No response received!");
			$('.overlay, .loader').fadeOut(300);
		}
	);
}
/*-------------------------- Pack Breakdown Service ends --------------------------*/

function gotoLookUpDetails(){
	if(localStorage['rangedItem']=='false'){
		localStorage['pageId']='LookupList';
		window.location = 'LookupList.html';
	}else{
		var articleNumber=$('#article-no').text();
		localStorage['pageId']='LookupDetails';
		localStorage['typeOfInput']='article';
		window.location = 'LookupDetails.html?'+ 'articleNumber='+ articleNumber;
	}	
}

/*-------------------------- Advanced Search service starts --------------------------*/

function advancedSearch(){
	var productSearchInput=$('#search-input').val();
	var onlyRanged=$('input[name=onlyRanged]').is(':checked'); 
	console.log('productSearchInput : ',productSearchInput, ' onlyRanged : ', onlyRanged);
	var articleContent='';
	var articleFlag=false;
	var rangedFlag=false;
	var rangedContent='';
	var filterContent='$filter=';
	if(productSearchInput!=''){
		articleFlag=true;
		if($.isNumeric(productSearchInput)){
			articleContent="iv_article eq '"+productSearchInput+"' and ";
		}else{
			articleContent="iv_desc eq '*"+encodeURIComponent(productSearchInput)+"*' and ";
		}
		filterContent=filterContent+articleContent;
	}
	if(onlyRanged){
		rangedFlag=true;
		rangedContent="iv_ranged  eq 'X' and ";
		filterContent=filterContent+rangedContent;
	}
	console.log(articleContent, rangedContent, filterContent);
	var tradeDept=$('#tradeDept option:selected').val();
	var coarseDept=$('#coarseDept option:selected').val();
	var fineDept=$('#fineDept option:selected').val();
	var subsection=$('#subsection option:selected').val();
	var sourceOfSupply=$("input:radio[name=sourceOfSupply]:checked").val();
	console.log('sourceOfSupply : ', sourceOfSupply);
	if(sourceOfSupply==undefined){
		sourceOfSupply='default';
	}
	console.log('sourceOfSupply : ', sourceOfSupply);
	var sourceSearch=$('#sourceSearch').val();
	var vendor=$('#vendor option:selected').val();
	var productLookupUri='';
	console.log(tradeDept, coarseDept, fineDept, subsection, sourceOfSupply, sourceSearch, vendor, 'SITE : ', site);
	if(tradeDept=="default" || coarseDept=="default" || fineDept=="default" || subsection=="default"){
		if(sourceOfSupply=="default" || vendor=="default"){
			if(productSearchInput!=''){
				localStorage['typeOfInput']='advanced';
				localStorage['searchTerm']=productSearchInput+" | "+articleFlag+" | "+rangedFlag;
				productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?"+filterContent+"iv_site eq '"+site+"'";
				console.log(productLookupUri);
				productLookup(productLookupUri);
			}else{
				console.log("default : error");
				$('#error-popup .popup-msg').text('Please select a search criteria');
				$('.loader').fadeOut(300);
				$('#error-popup, .overlay').fadeIn(300);
				centerAlign('#error-popup');
			}
		}else if(sourceOfSupply=="warehouse" && productSearchInput==''){
			console.log("Warehouse : error");
			$('#error-popup .popup-msg').text('Please enter article number or description');
			$('.loader').fadeOut(300);
			$('#error-popup, .overlay').fadeIn(300);
			centerAlign('#error-popup');
		}else{
			localStorage['typeOfInput']='advanced';
			localStorage['searchTerm']=vendor+" | "+articleFlag+" | "+rangedFlag;
			if(sourceOfSupply=='warehouse')
				productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?"+filterContent+"iv_sos eq '2' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"'";
			else if(sourceOfSupply=='direct-vendor')
				productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?"+filterContent+"iv_sos eq '1' and iv_supplier eq '"+vendor+"' and iv_site eq '"+site+"'";
			console.log(productLookupUri);
			productLookup(productLookupUri);
		}
	}else{
		localStorage['searchTerm']=subsection+" | "+articleFlag+" | "+rangedFlag;
		console.log("Segment selected : ",subsection );
		localStorage['typeOfInput']='advanced';
		productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?"+filterContent+"iv_hier_node eq '"+subsection+"' and iv_site eq '"+site+"'";
		console.log(productLookupUri);
		productLookup(productLookupUri);
	}
}

/*-------------------------- Advanced Search service start --------------------------*/


function toggleMenu(selector){
	var disp = $("#profile-drop").css('display');
	if(disp=='block'){
		$("#user-icon").attr("src", "../images/topMenu.png");
		setTimeout(function(){
			$(selector).hide();
		},300);
	}else{
		$("#user-icon").attr("src", "../images/topMenuOpen.png");
		setTimeout(function(){
			$(selector).show();
		},100);
	}
}

function toggleArticle() {
	$("#article-details-section").toggle();
//	$(".order-details, .price-details, .sales-details, .general-details").removeClass("downDrop");
	setHeight();
/*	$("#order-details-section").hide();
	$("#sales-details-section").hide();
	$("#price-details-section").hide();
	$("#basic-details-section").hide();
	$("#vendor-details-section").hide();
	$("#general-details-section").hide();
	$("#order-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	$("#sales-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	$("#price-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	$("#basic-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	$("#vendor-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	$("#general-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
	orderToggle="down";
	salesToggle="down";
	priceToggle="down";
	basicToggle="down";
	vendorToggle="down";
	generalToggle="down";
*/	refreshScroll();
	if(articleToggle=="down"){
		$("#article-arrow-toggle").attr("src","../images/LookUp_UpArrow.png");
		articleToggle="up";
		$(".article-details").addClass("downDrop");
		$("#article-details-section").addClass("downDropSection");
	}else{
		$("#article-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
		articleToggle="down";
		$(".article-details").removeClass("downDrop");
		$("#article-details-section").removeClass("downDropSection");
	}
}

function toggleOrder()
{
	$("#order-details-section").toggle();
	setHeight();
	refreshScroll();
	if(orderToggle=="down"){
		$("#order-arrow-toggle").attr("src","../images/LookUp_UpArrow.png");
		orderToggle="up";
		$(".order-details").addClass("downDrop");
		$("#order-details-section").addClass("downDropSection");
	}else{
		$("#order-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
		orderToggle="down";
		$(".order-details").removeClass("downDrop");
		$("#order-details-section").removeClass("downDropSection");
	}
}
 
function togglePrice()
{
	$("#price-details-section").toggle();
	setHeight();
	refreshScroll();
	if(priceToggle=="down"){
		$("#price-arrow-toggle").attr("src","../images/LookUp_UpArrow.png");
		priceToggle="up";
		$(".price-details").addClass("downDrop");
		$("#price-details-section").addClass("downDropSection");
	}else{
		$("#price-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
		priceToggle="down";
		$(".price-details").removeClass("downDrop");
		$("#price-details-section").removeClass("downDropSection");
	}
}

function toggleSales(){
	$("#sales-details-section").toggle();
	setHeight();
	refreshScroll();
	if(salesToggle=="down"){
		$("#sales-arrow-toggle").attr("src","../images/LookUp_UpArrow.png");
		salesToggle="up";
		$(".sales-details").addClass("downDrop");
		$("#sales-details-section").addClass("downDropSection");
	}else{
		$("#sales-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
		salesToggle="down";
		$(".sales-details").removeClass("downDrop");
		$("#sales-details-section").removeClass("downDropSection");
	}
}

function toggleGeneral(){
	$("#general-details-section").toggle();
	setHeight();
	refreshScroll();
	if(generalToggle=="down"){
		$("#general-arrow-toggle").attr("src","../images/LookUp_UpArrow.png");
		generalToggle="up";
		$(".general-details").addClass("downDrop");
		$("#general-details-section").addClass("downDropSection");
	}else{
		$("#general-arrow-toggle").attr("src","../images/LookUp_DownArrow.png");
		generalToggle="down";
		$(".general-details").removeClass("downDrop");
		$("#general-details-section").removeClass("downDropSection");
	}
}
	
/*-------------------------- Site / Other stores Search service start --------------------------*/
	
 /*function showOtherStores(){
	 console.log(localStorage['typeOfInput']);
	 var typeOfInput=localStorage['typeOfInput'];
	 if(typeOfInput=='advanced'){
		 localStorage['tabClicked'] = 'AdvancedOtherStores';
	 }else{
		 localStorage['tabClicked'] = 'OtherStores';
	 }
	 console.log("localStorage['tabClicked'] : ", localStorage['tabClicked']);
	 $('.overlay, .loader').fadeIn(300);
	 centerAlign('.loader');
	 var productSearchInput=$('#search-input').val();
	 $('.greenSep-left').css('visibility', 'hidden');
	 $('.greenSep-right').css('visibility', 'visible');
	 if(productSearchInput.trim()!=''){
		 if ($.isNumeric(productSearchInput) && typeOfInput!='advanced'){
			 $('.srch-rslt-txt').removeClass('greenTab fontWhite');
			 $('.srch-rslt-txt').addClass('fontGreen');
			 $('.other-stores-txt').removeClass('fontGreen');
			 $('.other-stores-txt').addClass('greenTab fontWhite');
			 $('.srch-rslt-list').hide();
			 $('.other-stores-list').show();
			 if(productSearchInput.length==4){
				console.log('==4');
				localStorage['typeOfInput']='plu';
				localStorage['checkArticleAndPlu']='true';
				localStorage['pluFlag']=false;
				localStorage['articleFlag']=false;
				localStorage['bothFlag']=false;
				//checkArticleAndPlu(productSearchInput, '1');
				localStorage['pageId']='LookupList';
				window.location='LookupList.html';
			 }else{
				 getOtherStoreDetails(productSearchInput);
			 }
		 }
		 else{
			 $('.srch-rslt-txt').removeClass('greenTab fontWhite');
			 $('.srch-rslt-txt').addClass('fontGreen');
			 $('.other-stores-txt').removeClass('fontGreen');
			 $('.other-stores-txt').addClass('greenTab fontWhite');
			 $('.srch-rslt-list').hide();
			 $('#content #itemList .other-stores-list').html('');
			 $('.other-stores-list').show();
			 localStorage['searchTerm']=productSearchInput;
			 if(typeOfInput!='advanced'){
				 localStorage['typeOfInput']='description';
			 }
			 productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_desc  eq '*"+encodeURIComponent(productSearchInput)+"*' and iv_site eq '"+site+"'";
	 		 productLookup(productLookupUri);
		 }
 	}else{
 		 $('.srch-rslt-txt').removeClass('greenTab fontWhite');
		 $('.srch-rslt-txt').addClass('fontGreen');
		 $('.other-stores-txt').removeClass('fontGreen');
		 $('.other-stores-txt').addClass('greenTab fontWhite');
		 $('.srch-rslt-list').hide();
		 $('#content #itemList .other-stores-list').html('');
		 $('.other-stores-list').show();
 		 var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Please enter search term.</div>';
 		 $('#content #itemList .other-stores-list').html(errMsg);
 		 $('.overlay, .loader').fadeOut();
 	}
 }*/
 
 function getOtherStoreDetails(articleNumber, storeNumber, salesOrg, distance, maxNoOfStores){
	 $('#content #itemList .other-stores-list').html('');
	var storeSearchUri=uriPrefix+"ZSP_SITES_ARTICLE/zsp_sites_articleCollection?$filter=iv_article eq '"+articleNumber+"' and iv_site eq '"+storeNumber+"' and iv_s_org eq '"+salesOrg+"' and iv_distance eq "+distance+" and iv_records eq "+maxNoOfStores+" and iv_ranged eq 'X' and iv_dc eq '10'"; 
	var storeSearchHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : storeSearchUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	};
	OData.request(storeSearchHeader,
		function (data, response){
			console.log('Site search URI : ', storeSearchUri);
			var len = data.results.length;
			console.log("Length : ", len);
			if(len>=1){
				for (var i = 0; i < data.results.length; i++) {
					var siteNo = data.results[i].site_no;
					console.log("siteNo", siteNo, "storeNo", storeNumber);
					//if(siteNo!=''){
						var siteName = data.results[i].site_name;
						/*if ( storeNumber == siteNo) {
							continue;
						}*/
						//var sOrgName = data.results[i].s_org_no+" | "+data.results[i].s_org_name;
						var distance =  parseFloat(data.results[i].distance);
						console.log(data.results[i].distance);
						//if(distance<1){
						//	proximity='less than 1 km';
						//}else{
							proximity=distance.toFixed(2)+' km';
						//}
						var sellPrice = data.results[i].std_sell_price;
						var promoPrice = data.results[i].promo_sell_price;
						var stockOnHand = data.results[i].stock_on_hand;
						var stockBox='';
						var stockText='';
						if(stockOnHand>0){
							stockBox='ranged-box';
							stockText='In Stock';
						}else{
							stockBox='non-ranged-box';
							stockText='Not in Stock';
						}
						var stockOnOrder = data.results[i].stock_on_order;
						var stockInTransit = data.results[i].stock_in_transit;
						var orderMultiple = '';
						var daysOnHand = '';
						var mpl = data.results[i].curr_mpl;
						if(mpl=='0'){
							mpl='';
						}
						var DOM = '<div class="levelThree otherStoresWrapper">'
						 +'<div class="levelOne"><table class="lukup-lst-itm ranged"><tbody><tr>'
						+'<td colspan="2" class="item-desc-txt siteDetails downArrow">Store # &nbsp; '
						+siteNo+ '<input type="hidden" value="" id="isLoaded"></td></tr>'
						+'<tr><td colspan="2" class="item-desc-txt description siteName">'+siteName+'</td></tr>'
						+'<tr><td colspan="2" class="item-desc-txt"><span class="proximity">'+proximity+'</span><span class="td-right posAbs"><span class="'+stockBox+'">'+stockText+'</span></span></td></tr></tbody></table>'
						+'<div class="articleInfoForSite hide ranged">'
					    +'<div class="height30"><div class="left-align text-align-right width50">Sell Price :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="sellPrice">'+sellPrice+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Promo Price :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="promoPrice">'+promoPrice+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Stock On Hand :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="stockOnHand">'+stockOnHand+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Stock On Order :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="stockOnOrder">'+stockOnOrder+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Stock In Transit :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="stockInTransit">'+stockInTransit+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Order Multiple :&nbsp; </div><div class="right-align width50 item-val dark-green normal" id="orderMultiple">'+orderMultiple+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">Days On Hand :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="daysOnHand">'+daysOnHand+'</div></div>'
				     	+'<div class="height30"><div class="left-align text-align-right width50">MPL :&nbsp;</div><div class="right-align width50 item-val dark-green normal" id="mpl">'+mpl+'</div></div><div>'
				     	+'</div></div></div></div>';
					     
						$('#content #itemList .other-stores-list').append(DOM);
					//}
				}	
			    toggleArticleInfoForSite(articleNumber);
				setHeight();
				refreshScroll();
				$('.overlay, .loader').fadeOut();
			}else{
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Stores to Display</div>';
				$('#content #itemList .other-stores-list').html(errMsg);
				$('.overlay, .loader').fadeOut();
			}
		},function(err) {
			var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Server not responding</div>';
			$('#content #itemList .other-stores-list').html(errMsg);
			$('.overlay, .loader').fadeOut();
			console.log("Store Search - Error! No response received.");
		}
	); 
	
 }
 
 function toggleArticleInfoForSite(articleNumber){
	 $('.other-stores-list .otherStoresWrapper .lukup-lst-itm').click(function(){
		 if($(this).find('.siteDetails').hasClass('downArrow')){
			 console.log('hasClass', this);
			 if($('.other-stores-list').find('.siteDetails').hasClass('upArrow')){
				 $('.other-stores-list').find('.upArrow').closest('.otherStoresWrapper').find('.articleInfoForSite').hide();
				 $('.other-stores-list').find('.upArrow').removeClass('upArrow').addClass('downArrow');
				 console.log('UP');
			 }
			 else{
				 console.log('DOWN');
			 }
			 $(this).find('.siteDetails').removeClass('downArrow').addClass('upArrow');
			 $(this).parent().find('.articleInfoForSite').show();
			 $(this).parent().find('.articleInfoForSite').show();
			 setHeight();
			 refreshScroll();
		 }else{
			 $(this).parent().find('.articleInfoForSite').hide();
			 $(this).find('.siteDetails').removeClass('upArrow').addClass('downArrow');
		 }
		 var site=$(this).find('.siteDetails').text().split(' | ')[0];
		 console.log('Open Site : ', site);
	 });
 }
 
 /*-------------------------- Site / Other stores Search service end --------------------------*/
 
 /*-------------------------- Receive Order Validations start --------------------------*/
 
 function onblurFields(fieldName){
	 if(fieldName=='temperature'){
		 var temperature=$('.temperature').filter(':visible').val();
		 console.log('on blur temperature', temperature);
		 if(temperature!=""){
			 var t=$('.temp').filter(':visible');
			 tempValidation(t);
		 }
		 else{
			 $('.temperatureErr').show();
			 $('.temperature').filter(':visible').focus();
		 }
	 }else if(fieldName=='invoiceNumber'){
		 var invoiceNumber=$('.other-invoiceNumber').val();
		 console.log('on blur invoiceNumber', invoiceNumber);
		 if(invoiceNumber!=""){
			 $('.invoiceErr').hide();
			 $('#fieldName').val('invoiceNumber');
			 $('#reEnter-popup .text-pop').text('Re-enter invoice number');
			 $('.overlay, #reEnter-popup').fadeIn(500);
			 centerAlign('#reEnter-popup');
			  $("#reEnter-popup #reEnterCheck").focus();
		 }
		 else{
			 $('.tempInvoice,.other-invoiceTotal,.other-gst').attr("disabled","true");
			 $('.tempInvoice,.other-invoiceTotal,.other-gst').attr("readonly","readonly");
			 $('.other-docketNumber').removeAttr("disabled  readonly").focus(); 
		 }
	 }else if(fieldName=='invoiceTotal'){
		 var invoiceTotal=$('.other-invoiceTotal').val();
		 console.log('on blur invoiceTotal', invoiceTotal);
		 if(invoiceTotal!=""){
			 $('.invoiceTotalErr').hide();
			 $('#fieldName').val('invoiceTotal');
			 $('#reEnter-popup .text-pop').text('Re-enter invoice total');
			 $('.overlay, #reEnter-popup').fadeIn(500);
			 centerAlign('#reEnter-popup');
			 $("#reEnter-popup #reEnterCheck").val('');
			 $("#reEnter-popup #reEnterCheck").focus();
		 }
		 else{
			 $('.invoiceTotalErr').text('Enter invoice total');
			 $('.invoiceTotalErr').show();
			 $('.other-invoiceTotal').focus();
		 }
	 }else if(fieldName=='gst'){
		 var gst=$('.other-gst').val();
		 console.log('on blur gst', gst);
		 if(gst!=""){
			 $('.gstErr').hide();
			 $('#fieldName').val('gst');
			 $('#reEnter-popup .text-pop').text('Re-enter GST');
			 $('.overlay, #reEnter-popup').fadeIn(500);
			 centerAlign('#reEnter-popup');
			 $("#reEnter-popup #reEnterCheck").val('');
			 $("#reEnter-popup #reEnterCheck").focus();
		 }
		 else{
			 $('.gstErr').text('Enter GST');
			 $('.gstErr').show();
			 $('.other-gst').focus();
		 }
	 }else if(fieldName=='docketNumber'){
		 var docketNumber=$('.other-docketNumber').val();
		 console.log('on blur docketNumber', docketNumber);
		 if(docketNumber!=""){
			 $('.docketNumberErr').hide();
			 $('#fieldName').val('docketNumber');
			 $('#reEnter-popup .text-pop').text('Re-enter docket number');
			 $('.overlay, #reEnter-popup').fadeIn(500);
			 centerAlign('#reEnter-popup');
			 $("#reEnter-popup #reEnterCheck").val('');
			 $("#reEnter-popup #reEnterCheck").focus();
		 }
		 else{
			 $('.docketNumberErr').text('Enter docket number');
			 $('.docketNumberErr').show();
			 $('.other-docketNumber').focus();
		 }
	 }
}
 
 /*function checkMatch(){
	 var fieldName=$('#fieldName').val();
	 if(fieldName=='invoiceNumber'){
		 var invoiceNumber=$('.other-invoiceNumber').val();
		 var repeatInvoiceNumber=$('#reEnterCheck').val();
		 if(invoiceNumber==repeatInvoiceNumber){
			 if($('.other-invoiceTotal').val() == "")
			 	{$('.other-invoiceTotal').focus();}
			 else if($('.other-gst').val() == ""){
				 $('.other-gst').focus();
			 }
		 }else{
			 $('.invoiceErr').text('Invoice numbers do not match');
			 $('.invoiceErr').show();
			 $('.other-invoiceNumber').focus();
		 }
	 } else if(fieldName=='invoiceTotal'){
		 var invoiceTotal=$('.other-invoiceTotal').val();
		 var repeatInvoiceTotal=$('#reEnterCheck').val();
		 if(invoiceTotal==repeatInvoiceTotal){
			 if($('.other-gst').val() == ""){
				 $('.other-gst').focus();
			 }
		 }else{
			 $('.invoiceTotalErr').text('Invoice total values do not match');
			 $('.invoiceTotalErr').show();
			 $('.other-invoiceTotal').focus();
		 }
	 }else if(fieldName=='gst'){
		 var gst=$('.other-gst').val();
		 var repeatgst=$('#reEnterCheck').val();
		 if(gst==repeatgst){
			 
		 }else{
			 $('.gstErr').text('GST values do not match');
			 $('.gstErr').show();
			 $('.other-gst').focus();
		 }
	 }else if(fieldName=='docketNumber'){
		 var docketNumber=$('.other-docketNumber').val();
		 var repeatDocketNumber=$('#reEnterCheck').val();
		 if(docketNumber==repeatDocketNumber){
			
		 }else{
			 $('.docketNumberErr').text('Docket numbers do not match');
			 $('.docketNumberErr').show();
			 $('.other-docketNumber').focus();
		 }
	 }
 }
*/ 
 /*-------------------------- Receive Order Validations end --------------------------*/

/*-------------------------- Create Order/IBT Validations starts --------------------------*/
function createOrderFinalize() {
	var pageId = localStorage['pageId'];
	var tableListitems = 0;
	if(pageId == 'createOrder') {
		tableListitems = $('.order-items-list').length;
	}
	else if(pageId == 'ibt') {
		tableListitems = $('.site-items-table').length;
	}
	if(tableListitems == 0) {
		if(pageId == 'ibt') {
			errorOkPopup("Please select an item to Transfer",".null");	
		}
		else {
			errorOkPopup("Please select an item to Order",".null");	
		}
	}
	else {		
		$('#send-to-vendor-popup .cancel').attr('onclick',"$('#send-to-vendor-popup, #overlay').fadeOut();");
		$('#send-to-vendor-popup, #overlay').fadeIn();
		centerAlign('#send-to-vendor-popup');
	//	setTimeout(function() {
			$('#send-to-vendor-popup ').height((window.innerHeight)-2);
			$('#send-to-vendor-popup ').width((window.innerWidth)-2);
	//	}, 2000);
	}
}

function cancelFinalize() {
	$('#send-to-vendor-popup, #overlay').fadeOut();
	$(".transfer-items-list").remove();
	$(".site-items-table").remove();
	clearOrders();
}

function ibtSendNowOk(){
	$('#ibt-success-popup').fadeOut();
	$('.overlay, .loader').fadeIn();
	var poNumber=$('#ibt-success-popup').find('.ibt-no').text();
	var tokenUri = directUriPrefix+"ZSP_IBT_ORDER_GI/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
    oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
		var tokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : tokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(tokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			ibtGoodsMovement(poNumber, header_xcsrf_token);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		});
	
}

function ibtGoodsMovement(poNumber, header_xcsrf_token){
	var inputData="<?xml version='1.0' encoding='utf-8' standalone='yes'?> " +
			"<atom:entry xml:lang='en'  xmlns:atom='http://www.w3.org/2005/Atom' " +
			"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' " +
			"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' " +
			"xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
			"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_ORDER_GI/'> " +
			"<atom:content type='application/xml'> " +
			"<m:properties> " +
			"<d:IV_PO_NO >"+poNumber+"</d:IV_PO_NO > " +
			"</m:properties> " +
			"</atom:content> " +
			"</atom:entry>";
	var ibtGoodsMovementUri=directUriPrefix+'ZSP_IBT_ORDER_GI/IBT_GI';
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	console.log("Header fields : ", oHeaders);
	/*var ibtGoodsMovementHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : ibtGoodsMovementUri, // OData endpoint URI
		method : "POST",
		data : inputData
	};*/
	$.ajax({
		url: ibtGoodsMovementUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("success");
			var orderNumber=$(data).find("IV_PO_NO").text();
			console.log('orderNumber : ', orderNumber);
			$('.loader').fadeOut();
			$('#ibt-popup #order-no').text(orderNumber);
			$('#ibt-popup, .overlay').fadeIn();
			centerAlign('#ibt-popup');
			
		},
		error:  function(err) {
			$('.loader').fadeOut();
			console.log("Error! No response received.", err.message);
		}
	
	});
}

function orderSendNowOk(){
	$('#success-popup,.overlay').fadeOut();	
	$(".order-items-list").remove();
}
/*-------------------------- Create Order/IBT Validations ends --------------------------*/
/*---------------------- Create Order service starts ----------------------*/
function sendNow(){ 
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var headerPartOne='<?xml version="1.0" encoding="utf-8"?>\n'
		+'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"\n'
		+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
		+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
		+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
		+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_ORDER_CREATION/">\n'
		+'<atom:content type="application/xml">\n'
		+'<m:properties>\n';
	var headerPartTwo='</m:properties>\n'
		+'</atom:content>\n'
		+'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/OrderItems"\n'
		+'type="application/atom+xml;type=feed"\n'
		+'title="ZSP_ORDER_CREATION.OrderHeader_OrderItems">\n'
		+'<m:inline>\n'
		+'<atom:feed>\n';
	var footer='</atom:feed>\n'
		+'</m:inline>\n'
		+'</atom:link>\n'
		+'</atom:entry>\n';
	var vendorDetails='';
	var articleDetails='';
	$.each($('.order-list-item'),function(){
		var vendor=$(this).find('.vendorNo').val();
		console.log('Vendor : ', vendor);
		var docType='ZNB';
		var compCode='1000';
		//var purGroup='001';
		/*var vendorDetails='<d:IV_VENDOR>'+vendor+'</d:IV_VENDOR>\n'
		      +'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
		      +'<d:IV_OPERATION>C</d:IV_OPERATION>\n';*/
			vendorDetails='<d:IV_COMP_CODE>'+compCode+'</d:IV_COMP_CODE>\n'
						 +'<d:IV_DOC_TYPE>'+docType+'</d:IV_DOC_TYPE>\n'
						 +'<d:IV_VENDOR>'+vendor+'</d:IV_VENDOR>\n'
						 +'<d:IV_PURCH_ORG></d:IV_PURCH_ORG>\n'
						 +'<d:IV_PUR_GROUP></d:IV_PUR_GROUP>\n'
						 +'<d:IV_SITE>'+site+'</d:IV_SITE>\n';
			
			var itemNo=$(this).find('.articleNo').text();
			console.log('Item No : ', itemNo);
			var description=$(this).find('.description').text();
			console.log('Desc : ', description);
			var deliveryDate=$(this).find('.delviDate').text();
			deliveryDate=deliveryDate.split('-')[0]+deliveryDate.split('-')[1]+deliveryDate.split('-')[2];
			console.log('Del Date : ', deliveryDate);
			var uom=$(this).find('.edituom').text();
			console.log('UOM : ', uom);
			var orderDate =$(this).find('.roster-date').val();
			orderDate=orderDate.split('-')[0]+orderDate.split('-')[1]+orderDate.split('-')[2];
			console.log('Creation Date : ', orderDate);
			var qty=$(this).find('.editCalculatedQuantity').text();
			console.log('Qty : ', qty);
			var soh=$(this).find('.soh').text();
			console.log('SOH : ', soh);
			articleDetails=articleDetails+'<atom:entry>\n'
						+'<atom:content type="application/xml">\n'
						+'<m:properties>\n'
						+'<d:IV_VENDOR>'+vendor+'</d:IV_VENDOR>\n'
						+'<d:IV_ARTICLE>'+itemNo+'</d:IV_ARTICLE>\n'
						+'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
						+'<d:IV_QTY>'+qty+'</d:IV_QTY>\n'
						+'<d:IV_ORDER_CUST></d:IV_ORDER_CUST>\n'
						+'<d:IV_DEL_DATE>'+deliveryDate+'</d:IV_DEL_DATE>\n'
						+'<d:IV_STGE_LOC></d:IV_STGE_LOC>\n'
						+'<d:IV_UOM>'+uom+'</d:IV_UOM>\n'
						+'</m:properties>\n'
						+'</atom:content>\n'
						+'</atom:entry>\n';
	});
	var requestXML=headerPartOne+vendorDetails+headerPartTwo+articleDetails+footer;
	console.log(requestXML);
	getOrderToken(requestXML);
}

function getOrderToken(inputStr){
	console.log('Getting token -  Order');
	var placeOrderTokenUri = directUriPrefix+"ZSP_ORDER_CREATION/";
	//var placeOrderTokenUri = uriPrefix+"ZSP_ORDER_CREATION/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var placeOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : placeOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(placeOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			placeOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		}
	);
}

function createOrderError(){
	console.log("Error! No response received.");
	$('.loader').fadeOut(300);
	$('#error-popup .popup-msg').text('Server not responding');
	$('#error-popup, #overlay').fadeIn();
	centerAlign('#error-popup');
}

function placeOrder(header_xcsrf_token, inputData){
	console.log(inputData);
	var placeOrderUri=directUriPrefix+"ZSP_ORDER_CREATION/OrderHeaders";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	console.log("Header fields : ", oHeaders);
	var placeOrderHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : placeOrderUri, // OData endpoint URI
		method : "POST",
		data : inputData
	};
	console.log(placeOrderHeader);
	$.ajax({
		url: placeOrderUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("Success! ");
			console.log('response :', response);
			console.log('data :', data);
			console.log(data.results);
				flag=true;
				var msg=$(data).find("IV_MSG").text();
				if(msg==''){
					wool.deleteRows('OrderListTable');
					wool.commit();
					var orderNumber=$(data).find("IV_ORDER_NO").text();
					$('.srch-rslt-list').html('');
					$('#no-of-items').text('0');
					$('.loader').fadeOut(300); 
					$('#order-no').text(orderNumber);
					$('.success-txt').text('Order Creation successful. ');
					$('#exit-popup, #overlay').fadeIn();
					centerAlign('#exit-popup');
				}else{
					$('.loader').fadeOut(300); 
					$('#error-popup .head-title').text('Error');
					$('#error-popup .popup-msg').text('Order Posting failed in SAP - '+msg);
					$('#error-popup .ok').attr('onclick',"$('#error-popup,.overlay').fadeOut(500);");
					$('#error-popup, #overlay').fadeIn();
					centerAlign('#error-popup');
				}
				
				
				//validateBack();
			},
		error:  function(err) {
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
			console.log("Error! No response received.", err.message);
		}
	});
} 
/*---------------------- Create Order service starts ----------------------*/
/*-------------------------- Create Order Validations start --------------------------*/

function getStore(searchStore, searchArticle){
	console.log('In getStore');
	var getStoresUri='';
	 if($.isNumeric(searchStore)){
		 getStoresUri= uriPrefix+"ZSP_STORE_LOOKUP/zsp_store_lookupCollection?$filter=iv_site_no eq '"+searchStore+"'";
	 }else{
		getStoresUri=uriPrefix+"ZSP_STORE_LOOKUP/zsp_store_lookupCollection?$filter=iv_site_name eq '*"+encodeURIComponent(searchStore)+"*'";	 
	 }
	 console.log('Store Search URI '+getStoresUri);
	 if(!wool.tableExists("StoreSrchRslt")){
		 wool.createTable("StoreSrchRslt", ["SearchStore", "StoreName", "StoreNo", "SalesOrg"]);
		 console.log('StoreSrchRslt table created');
	 }
	 wool.commit();
	 var getStoresHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value
							// pairs
		requestUri : getStoresUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	 };
	 OData.read(getStoresHeader, 
		function(data, response) {
			var numberOfSuppliers=data.results.length;
			console.log('URI : ',getStoresUri, ' Response Length : ', data.results.length);
			if(numberOfSuppliers>1){
				console.log('\n Result Length >1');
				for (var i = 0; i < data.results.length; i++) {
					console.log(JSON.stringify(data.results[i])+'\n');
					var storeName = data.results[i].site_name;
					var storeNo =data.results[i].site_no;
					var salesOrg=data.results[i].s_org_no;
					wool.insert('StoreSrchRslt',
					{
						SearchStore: searchStore,
						StoreName: storeName, 
						StoreNo: storeNo,
						SalesOrg: salesOrg
					});
					wool.commit();
					console.log('\n Inserted ' +storeName+ ' row to StoreSrchRslt');
			    }
				localStorage['CI_searchVendor']=searchStore;
				localStorage['pageId']='vendorSearchResults';
				window.location='vendorSearchResults.html';
			}else if(numberOfSuppliers==1 && data.results[0].msg!='No Data Found'){
					console.log('numberOfSuppliers==1');
					var storeName = data.results[0].site_name;
					var storeNo =data.results[0].site_no;
					localStorage['searchSupplier_ibt'] = storeNo;
					localStorage['searchSupplierName_ibt'] =  storeName;
					localStorage['previousPage']='ibt';
					console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
					productSearch();
			}else { 
				//No Items Found
				errorOkPopup("No vendors found.",".null");
			}
		}, function(err) {
			errorOkPopup("Server not responding",".null");
		}
	);
}

function populateStoreSearchResults(searchStore){
	if(!wool.tableExists("StoreSrchRslt")){
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No stores to Display</div>';
		$('#content').html(errMsg);
	}else{
		var searchResults = wool.query("StoreSrchRslt", {
			SearchStore : searchStore
		});
		for ( var i = 0; i < (searchResults.length); i++) {
			var storeNo = searchResults[i].StoreNo;
			var salesOrg = searchResults[i].SalesOrg;
			var storeName = toProperCase(searchResults[i].StoreName);
			var store=storeNo+" | "+storeName+" | "+salesOrg;
			var storeItem='<div class="levelThree storeItem"><div class="levelOne">'
				+'<table class="order-lst-itm fontHel font14">'
				+'<tbody><tr><td colspan="2"><input type="radio" name="store" value="'+store+'"/></td><td>'
				+'<span class="item-desc-val bold">Store #</span>'
				+'<span class="item-desc-val storeNo bold">'+storeNo+'</span></td>'
				+'</tr><tr><td colspan="2" class="item-desc-val"></td>'
				+'<td><span class="description storeName">'+storeName+'</span></td>'
				+'</tr></tbody></table></div></div>';
			$('#content').append(storeItem);
		}
	}
	$('.overlay, .loader').fadeOut(300);
	refreshScroll();
}

function getSupplier(searchVendor, searchArticle){
	var previousPage=localStorage['previousPage'];
	if(previousPage=='createOrder'){
		orderTypePrefix='CO';
		orderTypeSuffix='createOrder';
	}else if(previousPage=='createPreq'){
		orderTypePrefix='CP';
		orderTypeSuffix='createPreq';
	}else if(previousPage=='createOrderOnReceipt'){
		orderTypePrefix='COR';
		orderTypeSuffix='createOrderOnReceipt';
	}
	console.log('In getSupplier');
	var getSuppliersUri='';
	 if($.isNumeric(searchVendor)){
		 getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_no eq '"+searchVendor+"' and iv_site eq '"+site+"'";
	 }else{
		getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_name eq '*"+encodeURIComponent(searchVendor)+"*' and iv_site eq '"+site+"'";	 
	 }
	 console.log('Vendor Search URI '+getSuppliersUri);
	 if(!wool.tableExists("vendorSrchRslt")){
		 wool.createTable("vendorSrchRslt", ["SearchVendor", "VendorName", "VendorNo"]);
		 console.log('vendorSrchRslt table created');
	 }
	 wool.commit();
	 var getSuppliersHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value
							// pairs
		requestUri : getSuppliersUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	 };
	 OData.read(getSuppliersHeader, 
		function(data, response) {
			var numberOfSuppliers=data.results.length;
			console.log('URI : ',getSuppliersUri, ' Response Length : ', data.results);
			if(numberOfSuppliers>1){
				console.log('\n Result Length >1');
				for (var i = 0; i < data.results.length; i++) {
					console.log(JSON.stringify(data.results[i])+'\n');
					var vendorName = data.results[i].vendor_name;
					var vendorNo =data.results[i].vendor_no;
					wool.insert('vendorSrchRslt',
					{
						SearchVendor: searchVendor,
						VendorName: vendorName, 
						VendorNo: vendorNo
					});
					wool.commit();
					console.log('\n Inserted ' +vendorName+ ' row to vendorSrchRslt');
			    }
				localStorage[orderTypePrefix+'_searchVendor']=searchVendor;
				localStorage['pageId']='vendorSearchResults';
				window.location='vendorSearchResults.html';
			}else if(numberOfSuppliers==1 && data.results[0].msg!='No Data Found'){
					console.log('numberOfSuppliers==1');
					var vendorName = data.results[0].vendor_name;
					var vendorNo =data.results[0].vendor_no;
					localStorage['searchSupplier_'+orderTypeSuffix] = vendorNo;
					localStorage['searchSupplierName_'+orderTypeSuffix] =  vendorName;
					console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
					productSearch();
			}else { 
				//No Items Found
				errorOkPopup("No vendors found.",".null");
			}
		}, function(err) {
			errorOkPopup("Server not responding",".null");
		}
	);
	
}
/*-------------------------- Create Order Validations end --------------------------*/
 /*-------------------------- Load more items service starts --------------------------*/
 
function loadMoreItems(){
	var tabClicked='SearchResults';
	var pageNumber=parseFloat($('.pageNumber').val());
	var nextPageNumber=pageNumber+1;
	var description=localStorage['searchTerm'];
	console.log('Page Number : ', pageNumber, 'Next Page Number : ', nextPageNumber);
	var loadMoreItemUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_desc eq '*"+encodeURIComponent(description)+"*' and iv_site eq '"+site+"' and iv_ranged  eq 'X' and iv_records eq 20 and iv_page_no eq "+nextPageNumber+"";
	console.log('Load more Items URI : ', loadMoreItemUri);
	var loadMoreItemsHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : loadMoreItemUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	};
	OData.request(loadMoreItemsHeader,
		function (data, response){
			var len = data.results.length;
			console.log("Length : ", len);
			console.log('Removing More Loader ');
			$('.more-loader, .pageNumber').remove();
			if(len>1){
				  for (var i = 0; i < len; i++) {
					 console.log(data.results[i]);
					 var ranged = data.results[i].ranged_flag;
					 var articleNo = data.results[i].article.replace(/^0+/, '');
					 var description = data.results[i].description;
					 var soh=data.results[i].stock_on_hand;
					 var DOM='';
					 var tab='';
				     var box='';
				     var stockText='';
				     if(soh>0){
				    	 tab='ranged-tab';
				    	 box='ranged-box';
				    	 stockText='In Stock';
				     }else{
				    	 tab='non-ranged-tab';
				    	 box='non-ranged-box';
				    	 stockText='Not in Stock';
				     }
					 /*if(ranged=='N'){
						 DOM = '<table class="lukup-lst-itm fontHel bold font14 ranged"><tbody><tr>'
									+'<td class="item-desc-txt">Item No:</td><td class="item-desc-val grey articleNo">'
									+articleNo+ '</td></tr><tr><td class="item-desc-txt">Desc:</td>'
									+'<td class="item-desc-val grey description">'+description+'<input type="hidden" id="rangedFlag" value="false"></td></tr></tbody></table>';
					 }
					 else if(ranged=='Y'){*/
				     DOM = '<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
				     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
				     +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class="item-desc-val grey articleNo">'
				     +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
				     +description+'</div><input type="hidden" id="rangedFlag" value="true">'
				     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
				     +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
				     +'</tbody></table></div></div>';
					 //}
					 var searchKey=localStorage['searchTerm']+" | "+tabClicked;
					 insertSearchResult(searchKey, articleNo, description, ranged, soh);
					 $('#content #itemList .srch-rslt-list').append(DOM);
					 bindCLickEvent();
					 setHeight();
					 refreshScroll();
				 }
				 pageNumber=nextPageNumber+1;
				 var moreLoader='<div class="more-loader fontWhite txtCenter" onclick="$(\'.overlay, .loader\').fadeIn(300);centerAlign(\'.loader\');loadMoreItems();">Load more items</div><input type="hidden" class="pageNumber" value="'+nextPageNumber+'">';
				 console.log(moreLoader);
				 $('#content #itemList .srch-rslt-list').append(moreLoader);
				 setHeight();
				 refreshScroll();
				 $('.overlay, .loader').fadeOut(500);
			}else if(len==1){
				if(data.results[0].msg==""){
					 var ranged = data.results[0].ranged_flag;
					 var articleNo = data.results[0].article.replace(/^0+/, '');
					 var description = data.results[0].description;
					 var soh=data.results[0].stock_on_hand;
				     var tab='';
				     var box='';
				     var stockText='';
				     if(soh>0){
				    	 tab='ranged-tab';
				    	 box='ranged-box';
				    	 stockText='In Stock';
				     }else{
				    	 tab='non-ranged-tab';
				    	 box='non-ranged-box';
				    	 stockText='Not in Stock';
				     }
					 var DOM='';
					 /*if(ranged=='N'){
						 DOM = '<table class="lukup-lst-itm fontHel bold font14 ranged"><tbody><tr>'
									+'<td class="item-desc-txt">Item No:</td><td class="item-desc-val grey articleNo">'
									+articleNo+ '</td></tr><tr><td class="item-desc-txt">Desc:</td>'
									+'<td class="item-desc-val grey description">'+description+'<input type="hidden" id="rangedFlag" value="false"></td></tr></tbody></table>';
					 }
					 else if(ranged=='Y'){*/
					 DOM = '<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
				     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
				     +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class="item-desc-val grey articleNo">'
				     +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
				     +description+'</div><input type="hidden" id="rangedFlag" value="true">'
				     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
				     +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
				     +'</tbody></table></div></div>';
					// }
					 var searchKey=localStorage['searchTerm']+" | "+tabClicked;
					 insertSearchResult(searchKey, articleNo, description, ranged, soh);
					 $('#content #itemList .srch-rslt-list').append(DOM);
					 bindCLickEvent();
					 setHeight();
					 refreshScroll();
				}
				console.log('Length 1');
				$('.overlay, .loader').fadeOut(500);
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No More Items to Display</div>';
				$('#content #itemList .srch-rslt-list').append(errMsg);
			}else{
				$('.overlay, .loader').fadeOut(500);
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No More Items to Display</div>';
				$('#content #itemList .srch-rslt-list').append(errMsg);
			}
		},function(err) {
			$('.overlay, .loader').fadeOut(500);
			var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Server not responding</div>';
			$('#content #itemList .srch-rslt-list').html(errMsg);
			console.log("Store Search - Error! No response received.");
		}
	);
}
 
/*-------------------------- Load more items service ends --------------------------*/

/*-------------------------- vendorSearchresults starts --------------------------*/
/*-------------------------- vendorSearchresults ends--------------------------*/

/*-------------------------- Show Adjustment History service starts --------------------------*/

function showPendingAdjustments(){
	 $('.adjustment-history-txt').removeClass('greenTab fontWhite');
	 $('.adjustment-history-txt').addClass('fontGreen');
	 $('.pending-adjustments-txt').removeClass('fontGreen');
	 $('.pending-adjustments-txt').addClass('greenTab fontWhite');
	 $('.adjustment-history').hide();
	 $('.pending-adjustments').show();
	 $('.finalise').show();
	 refreshScroll();
}

function toggleAdjustmentHistory(){
	var isVisible=$('#show-adjustment-history').hasClass('hideHistory');
	if(isVisible){
		$('#show-adjustment-history').removeClass('hideHistory').addClass('showHistory');
		$('.overlay, .loader').fadeIn();
		getAdjustmentHistory();
	}else{
		$('#show-adjustment-history').removeClass('showHistory').addClass('hideHistory');
		$('#adjustment-history-container').fadeOut(500);
		$('#show-adjustment-history').text('See Adjustment History');
		var wrapperH = localStorage['SA_initialHeight'];
			wrapperH = wrapperH - parseInt(20);
		document.getElementById('wrapper').style.height = wrapperH + 'px';
		var scrollerH = wrapperH + parseInt(60);
		document.getElementById('scroller').style.height = scrollerH + 'px';
		myScroll.scrollTo(0,0,0);
		setHeight();
		refreshScroll();
		//myScroll.scrollToElement('#stock-adjust-container', 100);
	}
}

function getAdjustmentHistory(){
	console.log('getAdjustmentHistory');
	$('#adjustment-history-container').html('');
	var adjustmentHeaderDOM="<div class='fontC35 bold'> History</div>";
	$('#adjustment-history-container').html(adjustmentHeaderDOM);
	var adjustmentHistoryDOM='';
	var movementType=''; //$(".reason-code option:selected").attr('reason-code');
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
	var currentDay=('0' + currentDate.getDate()).slice(-2);
	var toDate=currentYear+currentMonth+currentDay;
	var fiveDaysAgoDate=new Date();
	fiveDaysAgoDate.setDate(currentDate.getDate() - 30);
	var fiveDaysAgoYear=fiveDaysAgoDate.getFullYear();
	var fiveDaysAgoMonth=('0' + (fiveDaysAgoDate.getMonth()+1)).slice(-2);
	var fiveDaysAgoDay=('0' + fiveDaysAgoDate.getDate()).slice(-2);
	var fromDate=fiveDaysAgoYear+fiveDaysAgoMonth+fiveDaysAgoDay;
	var articleNumber=$('.articleNumber').text();
	var reasonCode='';
	var userId='';
	console.log('From Date : ', fromDate, ' to Date : ', toDate);
	var adjustmentHistoryUri=uriPrefix+"ZSP_SOH_HISTORY/zsp_soh_historyCollection?$filter=iv_site eq '"+site+"' and iv_date_from eq '"+fromDate+"' and iv_mvmt_type eq '"+movementType+"' and iv_user_id eq '"+userId+"' and iv_reason_code eq '"+reasonCode+"' and iv_date_to  eq '"+toDate+"' and iv_article eq '"+articleNumber+"'";
	//adjustmentHistoryUri="http://10.23.164.72:8000/ZSP_SOH_HISTORY/zsp_soh_historyCollection?$filter=iv_site%20eq%20'1008'%20and%20iv_date_from%20eq%20'20130801'%20and%20iv_mvmt_type%20eq%20'Z77'%20and%20iv_user_id%20eq%20''%20and%20iv_reason_code%20eq%20''%20and%20iv_date_to%20eq%20'20130822'%20and%20iv_article%20eq%20''";
	console.log('adjustmentHistoryUri : ', adjustmentHistoryUri);
	var adjustmentHistoryHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : adjustmentHistoryUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	};
	OData.request(adjustmentHistoryHeader,
		function (data, response){
			console.log('success', data.results.length, data.results.length-1, data.results.length-6, data.results);
			var dataLength=data.results.length;
			if(dataLength==1 && data.results[0].msg.length>5){
				adjustmentHistoryDOM="<table cellspacing='0' class='adj-history-item'>"
					+"<tr>"
					+"<th class='txtCenter pad2'>No items to display</th>"
					+"</tr>"
					+"</table>";
				$('#adjustment-history-container').append(adjustmentHistoryDOM);
			}else{
				var from=0;//dataLength-1;
				var to='';
				if(dataLength<=5){
					to=dataLength-1;
				}else{
					to=5;//dataLength-5;
				}
				console.log('LENGTH : ', dataLength, ' FROM : ', from, ' TO : ', to);
				for(var i=from; i<to; i++){
					console.log(i);
					var adjustmentDate=data.results[i].adjustment_date;
					var adjustmentTime=data.results[i].adjustment_time;
					var adjustedBy=data.results[i].user_id;
					var adjustmentQuantity=data.results[i].adjustment_qty;
					var soh=data.results[i].end_soh;
					var movementType=toProperCase(data.results[i].mvmt_type_desc);
					adjustmentHistoryDOM="<table cellspacing='0' class='adj-history-item font14'>"
						+"<tr>"
						+"<th class='pad2  width100 txtLft green bold'>Adjusted on:&nbsp;"+adjustmentDate+" &nbsp; "+adjustmentTime+"</th></tr>"
						+"<tr><th class='pad2 borderB width100 txtLft'>by <span class='adj-by padL5'>"+adjustedBy+"</span></th>"
						+"</tr>"
						+"<tr>"
						+"<td class='pad2 borderB width100'>Adjustment : <span class='adjustment padL5'>"+adjustmentQuantity+"</span>"
						+"<span class='right-align'>SOH : <span class='stockOnHand padL5 normal'>"+soh+"</span></td>"
						+"</tr>"
						+"<tr>"
						+"<td colspan='2' class='pad2'> <span class='adjust-reason bold'>Reason:&nbsp;<span class='normal grey'>"+movementType+"</span></span></td>"
						+"</tr>"
						+"</table>";
					console.log(adjustmentHistoryDOM);
					$('#adjustment-history-container').append(adjustmentHistoryDOM);
				}
			}
			$('#adjustment-history-container').fadeIn(300);
			$('#show-adjustment-history').text('Hide Adjustment History');
			myScroll.scrollTo(0,-200,200);
			//myScroll.scrollToElement('#show-adjustment-history', 100);
			//setHeight();
			var wrapperH=localStorage['SA_initialHeight'];
			var containerH = $('#adjustment-history-container').height();
			//	wrapperH = wrapperH - parseInt(40);
			document.getElementById('wrapper').style.height = wrapperH + 'px';
			var scrollerH = parseInt(wrapperH) + parseInt(containerH) + parseInt(60);
			document.getElementById('scroller').style.height = scrollerH + 'px';
			console.log('scrollerH: ', document.getElementById('scroller').style.height);
			refreshScroll();
			$('.overlay, .loader').fadeOut(500);
		}, function(err){
			adjustmentHistoryDOM="<table cellspacing='0' class='adj-history-item'>"
				+"<tr>"
				+"<th class='txtCenter pad2'>Server not responding</th>"
				+"</tr>"
				+"</table>";
			$('#adjustment-history-container').append(adjustmentHistoryDOM);
			$('#adjustment-history-container').fadeIn(300);
			$('#show-adjustment-history').text('Hide Adjustment History');
			refreshScroll();
			$('.overlay, .loader').fadeOut(500);
		});
}

/*-------------------------- Show Adjustment History service ends --------------------------*/

/*-------------------------- Barcode -> Article Details service starts --------------------------*/

function getArticleDetailsFromBarcode(articleFromGtin, pageId){
	$('#exit-popup, .overlay').fadeOut();
	console.log('In getArticleDetailsFromBarcode. Barcode : ', articleFromGtin);
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	//var articleFromGtin=getArticleNumberFromGTIN(barcode);
	//if(articleFromGtin!='' || articleFromGtin!='undefined')
	var articleDetailsFromBarcodeUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+articleFromGtin+"' and iv_site eq '"+site+"'";
	console.log('articleDetailsFromBarcodeUri : ', articleDetailsFromBarcodeUri);
	var articleDetailsFromBarcodeHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : articleDetailsFromBarcodeUri, // OData endpoint URI
		method : "GET",
		timeoutMS : 200000
	};
	OData.request(articleDetailsFromBarcodeHeader,
		function (data, response){
			console.log('success : ', data.results.length);
			console.log('Response : ', data.results);
			if(data.results.length==0 || (data.results.length==1 && data.results[0].msg=='No Data Found')){
				$('.loader').fadeOut();
				if(pageId=='stockAdjust'){
					$('#exit-popup #popup-msg').hide();
					$('#exit-popup #error-popup-msg').show();
					$('#exit-popup, .overlay').fadeIn();
					centerAlign('#exit-popup');
				}else{
					$('#error-popup .popup-msg').text('Item not found.');
					$('#error-popup, .overlay').fadeIn();
					centerAlign('#error-popup');
				}
			}else{
				var itemNo=data.results[0].article.replace(/^0+/, '');
				var desc=data.results[0].description;
				localStorage['descriptionFull']=desc;
				var soh=data.results[0].stock_on_hand;
				var baseQty=data.results[0].base_uom;
				var om=data.results[0].ord_mul;
				console.log('page : ', pageId);
				if(pageId=='stockLookup'){
					localStorage['SE_articleNumber']=itemNo;
					localStorage['SE_description']=desc;
					localStorage['SE_soh']=soh;
					localStorage['SE_uom']=baseQty;
					localStorage['SE_om']=om;
					localStorage['pageId']='stockAdjust';
					window.location='stockAdjust.html';
				}else{ //if(pageId=='createOrder'){
					//$('#search-input').val(itemNo);
					$('#articleNumber').text(itemNo);
					$('#description').text(desc);
					$('.quantityOM').text(om);
					$('.OMContainer').fadeIn();
					$('.stockOnHand').text(soh);
					$('.barcode-details').fadeIn(500);
					$('.quantityBlk').removeClass('hide');
					$('#footer').show();
					//$('.barcode-details').removeClass('hide');
					$('.overlay, .loader').fadeOut(300);
					setHeight();
					refreshScroll();
				}
			}
		}, function(err){
			$('.loader').fadeOut();
			$('#http-error-popup .popup-msg').text('Server not responding.');
			$('#http-error-popup, .overlay').fadeIn();
			centerAlign('#http-error-popup');
		});
}

function populateStockDetails(itemNo, desc, soh, baseQty, om){
	console.log('In populateStockDetails',itemNo," | ", desc," | ", soh," | ", baseQty," | ", om);
	om==0 ? (om=1):(om);
	var carVal = Number((soh/om).toFixed(afterDot));
	$('#articleNumber').text(articleNumber);
	$('#description').text(desc);
	//var sohText=soh+' '+baseQty;
	$('#soh').text(soh);
	$('#uom').text(baseQty);
	$('#om').text(om);
	$('#car-val').text(carVal);
	var stockCounter=parseInt(localStorage['SA_counter']);
	var prevReason=localStorage['SA_reason'];
	var prevAdjustment=localStorage['SA_adjustment'];
	console.log('BaseQty : ', baseQty, ' lower : ', baseQty.toLowerCase());
	if(stockCounter==0){
		if(Number(soh)<=0){
			$('.reason-code').val('Z77');
			displayPlusOrMinus();
		}else {
			$('.reason-code').val('Z78');
			displayPlusOrMinus();
		}
	}else{
		$('.reason-code').val(prevReason);
		displayPlusOrMinus();
	}
	if(baseQty.toLowerCase()=="kg"){
		isDecimalRequ=true; //Decimal required for weighted items
		console.log('In KG - isDecimalRequ : ', isDecimalRequ );
		if(stockCounter>0){
			$('.adjust').val(prevAdjustment);
			calculateNewSoh();
		}else{
			if(Number(soh)<=0){
				$('.new-soh').val('0');
				//$('.adjust').bind('focus', function(){
					//If Current SOH =< 0,UM=KG 
					//defaults to a value that would set  the new SOH to zero. 
					$('.new-soh').val('0');
					calculateAdjustment();
				//});
			}else {
				$('.new-soh').val('');
				//$('.adjust').bind('focus', function(){
					//If Current SOH > 0, field defaults to <blank>
					$('.adjust').val('');
					calculateNewSoh();
				//});
			}
		}
		calculateAdjustment();
	}
	if(baseQty.toLowerCase()=="ea"){
		isDecimalRequ=false;
		console.log('In EA - isDecimalRequ : ', isDecimalRequ );
		if(stockCounter>0){
			$('.adjust').val(prevAdjustment);
			calculateNewSoh();
		}else{
			if(Number(soh)<=0){
				$('.new-soh').val('0');
				//$('.adjust').bind('focus', function(){
					//If Current SOH =< 0, UOM=EA,
					//I3 defaults to a value that would set  the new SOH to zero.
					$('.new-soh').val('0');
					calculateAdjustment();
				//});
				
			}else {
				$('.new-soh').val(Number(soh)-1);
				//$('.adjust').bind('focus', function(){
					//If Current SOH > 0, UOM=EA,
					//I3 defaults to 1.
					var oldSOH = $('.soh').text();
					$('.new-soh').val(Number(oldSOH)-1);
					calculateAdjustment();
				//});
				
			}
		}
		//only numbers - no decimals
		$('.new-soh, .adjust').keypress(function(){
			return isNumber(event);	
		});
		calculateAdjustment();
	}
	
	$('#stockAdjust .new-soh').keyup(calculateAdjustment);
	$('#stockAdjust .adjust').keyup(calculateNewSoh);
	//$('#stockAdjust .adjust').change(calculateNewSoh);
	$('.reason-code').change(calculateNewSoh);
	$('.reason-code').change(displayPlusOrMinus);
	$('.overlay, .loader').fadeOut();
}

function displayPlusOrMinus(){
	console.log('In displayPlusOrMinus');
	var select = $('.reason-code option:selected').attr('reason-code');
	var indicator = $('.reason-code option:selected').attr('indicator');
	if(select=="252" || indicator=='S'){ //Plus adj qty
		$('#signIndicator').text('(+)');
	}else{ //Minus adj qty
		$('#signIndicator').text('(-)');
	}
}

/*-------------------------- Barcode -> Article Details service ends --------------------------*/
function onCancelUpdate() {
    $('#update-popup').fadeOut(500);
}

function showButtons() {
    $(".orderItems").next().show('fast');
    refreshScroll();
}
function tempValidation(y) {
        var tempVal = y.val();
        if(tempVal.length > 0){
        var department = localStorage['departmentNo'];
        console.log("Department number in tempValidation:---->",department);
        if (department == 003 || department == 004 || department == 008 || department == 012) {
            if (tempVal <= -18) {
                console.log("less than -18.do nothing");
                $(".question,.warningMsg").removeClass("hide").addClass("hide");
            } else if (tempVal > -18 && tempVal < 5) {
                console.log("greater than -18 but less than 5.Show popup.");
                //$('.loader').fadeOut(300);
                $(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Temperature too high');
                $('.question  .MsgText').text('Press No if frozen products are not are not frozen.');
            } else {
            	//$('.loader').fadeOut(300);
            	$(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Temperature too high');
                $('.question  .MsgText').text('Will items be rejected?');
            	
            }
        }
        
        if (department == 006) {
            if (tempVal <= -5) {
                console.log("less than -18.do nothing");
                
                $(".question,.warningMsg").removeClass("hide").addClass("hide");
            } else if (tempVal > -5 && tempVal < 5) {
                console.log("greater than -18 but less than 5.Show popup.");
                //$('.loader').fadeOut(300);
                $(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Is this delivery High Risk Produce?');
            } else {
            	//$('.loader').fadeOut(300);
            	$(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Will items be rejected?');
            }
        }
        if (department == 005) {
            if (tempVal <= -5) {
                console.log("less than -5.do nothing");
                $(".question,.warningMsg").removeClass("hide").addClass("hide");
            } else if (tempVal > -5 && tempVal < 7) {
                console.log("greater than -5 but less than 7.Show popup.");
                //$('.loader').fadeOut(300);
                $(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Will items be rejected?');
            } else {
                //$('.loader').fadeOut(300);
            	$(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Will items be rejected?');
            }
        }
        if (department == 70) {
            if (tempVal <= -15) {
                console.log("less than -15.do nothing");
                $(".question,.warningMsg").removeClass("hide").addClass("hide");
            } else if (tempVal > -15 && tempVal < 5) {
                console.log("greater than -15 but less than 5.Show popup.");
                //$('.loader').fadeOut(300);
                $(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Will items be rejected?');
                
            } else {
            	//$('.loader').fadeOut(300);
            	$(".question,.warningMsg").removeClass("hide");
            	$('.warningMsg  .MsgText').text('Incorrect Temperature');
                $('.question  .MsgText').text('Will items be rejected?');
               
            }
        }
    }
}
function onOkUpdate() {
	localStorage['receivedInvoice']="false";
    var checked = $('input[name="radio-choice-1"]:checked');
    if (checked.val() == "choice-1") {
        $('#update-popup,.overlay').fadeOut(200);
        $('#header-title').text('Update Order');
        $('.save-exit').removeClass('green-btn').addClass('grey-btn');
        $('.save-exit').attr("disabled","disabled");
        $('.finalise').removeClass('hide');
        $('.optionSelected').val(1);
        //allowDocketUpdate();
        refreshScroll();
    }
    if (checked.val() == "choice-2") {
        $('#update-popup').fadeOut(500);
        $('#docket-popup,.overlay').fadeIn(600);
        centerAlign('#docket-popup');
        $('.save-exit').addClass('green-btn').removeAttr("disabled").removeClass("grey-btn");
        //$('#final-popup .green-btn').removeAttr('onclick');
        //$('#final-popup .green-btn').attr('onclick',"$('#final-popup,.overlay').fadeOut(); getDocketFinalise();");
        $('.optionSelected').val(2);
    }
}
function docketValidation() {
	var orderStatus = localStorage['orderStatus'];
    var hostTemp = $(".tempField").first().val();
    var t=$('.temp').filter(':visible');
    if(hostTemp != "") {
        console.log("inside temperature field",hostTemp);
        $('.temp').removeAttr("disabled    readonly").focus();
        validateDocketField(hostTemp);
        /*t.blur(function () {
        	
        	tempValidation(t);

            if ((orderStatus == 'Open'))
            {
                console.log('Open');
                
                $('.other-deliveryDate,.other-RosterDate').removeAttr("disabled    readonly");   
                $('.finalise').removeClass('hide');
                allowDocketUpdate();
                refreshScroll();
            }
            else{
            $('.tempInvoice').removeAttr("disabled  readonly").focus();
            $('.other-invoiceTotal,.other-gst,.other-docketNumber').removeAttr("disabled    readonly");
            validateDocketField(hostTemp);
            checkMatch();
            enableDocketFinalize();
            }
        });*/ 
    }
    else{
    	 tempValidation(t);
        if ((orderStatus == 'Open'))
        {
            console.log('Open');
           
            $('.other-deliveryDate,.other-RosterDate').removeAttr("disabled    readonly");
            $('.finalise').removeClass('hide');
            allowDocketUpdate();
            refreshScroll();
        }
        else{
        $('.tempInvoice').removeAttr("disabled  readonly").focus();
        $('.other-invoiceTotal,.other-gst,.other-docketNumber').removeAttr("disabled    readonly");
        validateDocketField(hostTemp);
        checkMatch();
       // enableDocketFinalize();
        }
       
    }

}

function allowDocketUpdate() {
    $('.item-details').click(function () {
    	$(this).closest(".new").css("border-bottom","none");
    	$(this).css("border-bottom","none");
    	$(this).next().find(".confirm-btn").addClass('confirmBind');
        $(this).next().removeClass("hide");
        hiddenBtns();
    });
}

function enableDocketFinalize() {
	console.log("inside enableDocketFinalize");
    var invoiceTotal = $('.other-invoiceTotal').val();
    var gst = $('.other-gst').val();
    var docketNumber = $('.other-docketNumber').val();
    var invoiceNumber = $('.other-invoiceNumber').val();
    if (((docketNumber) != "") ||((gst && invoiceTotal && invoiceNumber) != "")) {
        $('.finalise').removeClass('hide');
        allowDocketUpdate();
        refreshScroll();
    }
}


function validateDocketField(tempHost) {
	$('#viewOrderDetails .input').blur(function () {
		console.log('Blurred!');
        if (tempHost != "") {
            if ($(this).hasClass('temperature')) {
                console.log('temperature!');
                onblurFields('temperature');
            }
        }
        if ($(this).hasClass('other-invoiceNumber')) {
            console.log('invoiceNumber!');
            onblurFields('invoiceNumber');
        } else if ($(this).hasClass('other-invoiceTotal')) {
            console.log('invoiceTotal!');
            onblurFields('invoiceTotal');
        } else if ($(this).hasClass('other-gst')) {
            console.log('gst!');
            onblurFields('gst');
        } else if ($(this).hasClass('other-docketNumber')) {
            console.log('docketNumber!');
            onblurFields('docketNumber');
        }
    });
}

function checkMatch() {
    var fieldName = $('#fieldName').val();
    if (fieldName == 'invoiceNumber') {
        var invoiceNumber = $('.other-invoiceNumber').val();
        var repeatInvoiceNumber = $('#reEnterCheck').val();
        if (invoiceNumber == repeatInvoiceNumber) {
            $('.overlay, #reEnter-popup').fadeOut(500);
            $("#reEnter-popup #reEnterCheck").val('');
            if($('.other-invoiceTotal').val() == "")
		 	{$('.other-invoiceTotal').focus();}
			 else if($('.other-gst').val() == ""){
				 $('.other-gst').focus();
			 }
            enableDocketFinalize();
            /// $('.other-invoiceTotal').focus();
        } else {
            $('.invoiceErr').text('Invoice numbers do not match');
            $('.invoiceErr').show();
            $("#reEnter-popup #reEnterCheck").val('');
            $('.other-invoiceNumber').focus();
        }
    } else if (fieldName == 'invoiceTotal') {
        var invoiceTotal = $('.other-invoiceTotal').val();
        var repeatInvoiceTotal = $('#reEnterCheck').val();
        if (invoiceTotal == repeatInvoiceTotal) {
            $('.overlay, #reEnter-popup').fadeOut(500);
            $("#reEnter-popup #reEnterCheck").val('');
            if($('.other-gst').val() == ""){
				 $('.other-gst').focus();
			 }
            enableDocketFinalize();
        } else {
            $('.invoiceTotalErr').text('Invoice total values do not match');
            $('.invoiceTotalErr').show();
            $("#reEnter-popup #reEnterCheck").val('');
            $('.other-invoiceTotal').focus();
        }
    } else if (fieldName == 'gst') {
        var gst = $('.other-gst').val();
        var repeatgst = $('#reEnterCheck').val();
        if (gst == repeatgst) {
            $('.overlay, #reEnter-popup').fadeOut(500);
            $("#reEnter-popup #reEnterCheck").val('');
            // $('.other-docketNumber').focus();
            enableDocketFinalize();
        } else {
            $('.gstErr').text('GST values do not match');
            $('.gstErr').show();
            $("#reEnter-popup #reEnterCheck").val('');
            $('.other-gst').focus();
        }
    } else if (fieldName == 'docketNumber') {
        var docketNumber = $('.other-docketNumber').val();
        var repeatDocketNumber = $('#reEnterCheck').val();
        if (docketNumber == repeatDocketNumber) {
        	$("#reEnter-popup #reEnterCheck").val('');
            enableDocketFinalize();
            //$('.other-docketNumber').focus();
            // $('#viewOrderDetails').css({"overflow":"scroll"});
        } else {
            $('.docketNumberErr').text('Docket numbers do not match');
            $('.docketNumberErr').show();
            $("#reEnter-popup #reEnterCheck").val('');
            $('.other-docketNumber').focus();
        }
    }
}

function doc() {
    $(document).find('.item-details').each(function () {
        y = $(this);
        var j = y.find('.received-qty').val();
        if (j !== 0) {
            console.log("inside 11zero");
        } else {
            console.log("inside zero");
            h = y.clone();
            $('#listItem').prepend(h);
            refreshScroll();
            y.remove();
        }
    });
}

/*------------------------ Order Receive Service starts ------------------------*/

function finalizeOrderReceipt(){
//	alert("confirm function is being called");
	$(".overlay,.loader").fadeIn();
	console.log('finalizeOrderReceipt');
	var receiveOrderTokenUri ="";
	var receiveOrderUri = "";
	var orderType=localStorage['orderType'];
	if(orderType != undefined){
	
	orderType.trim();
	}
	else{
		orderType == '';
	}
	orderStatus=localStorage['orderStatus'];
    var orderNo=localStorage['orderNo'];
    vendor=localStorage['sendingStore'];
    
    var inputStr='';
  		var currentDate=new Date();
		var currentYear=currentDate.getFullYear();
		var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
		var currentDay=('0' + currentDate.getDate()).slice(-2);
		date=currentYear+currentMonth+currentDay;
		console.log('in finalize order function orderType--> ', orderType ,'orderStatus-->',orderStatus ,'orderNo-->',orderNo,'vendor:-->',vendor,'date-->',date);
    if(orderStatus=='Open'){
    	var delDate= localStorage['deliveryDate'];
    	var newdeliveryArray = delDate.trim().split(".");
		var newdeliveryDate = newdeliveryArray[2]+newdeliveryArray[1]+newdeliveryArray[2];
		
    	inputStr = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n'
    		+'<atom:entry xml:lang="en"  xmlns:atom="http://www.w3.org/2005/Atom"\n'
    		+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
    		+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
    		+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n' 
    		+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_DELIVERY_DATE_UPDATE/">\n'
    		+'<atom:content type="application/xml">\n'
    		+'<m:properties>\n'
    		+'<d:iv_po_no>'+orderNo+'</d:iv_po_no>\n'
    		+'<d:iv_delivery_date>'+newdeliveryDate+'</d:iv_delivery_date>\n'
    		+'</m:properties>\n'
    		+'</atom:content>\n'
    		+'</atom:entry>'; 
    	
    	console.log("input string for updating open order",inputStr);
    	getOpenOrderUpdateToken(inputStr);
    }
    else if(orderStatus=='Received'){
    	var optionSelected = $(".optionSelected").val();
    	if(optionSelected == 2){
    		addInvoiceInputStr(orderNo,site,date,vendor);
    	}
    	
    	
    }
    
    else{
    	
    	var article = '';
 		var body="";
 		
    	if(orderType == "ZUB"){
    		
   	    var header='<?xml version="1.0" encoding="utf-8"?>\n'
			 	    	+'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"\n'
			 	    	+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
			 	    	+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
			 	    	+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
			 	    	+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_ORDER_ADJ/">\n'
			 	    	+'<atom:content type="application/xml">\n'
			 	    	+'<m:properties>\n'
			 	    	+'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
			 	    	+'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
			 	    	+'<d:IV_DATE>'+date+'</d:IV_DATE>\n'
			 	    	+'</m:properties>\n'
			 	    	+'</atom:content>\n'
			 	    	+'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/IBTItems"\n'
			 	    	+'type="application/atom+xml;type=feed"\n'
			 	    	+'title="ZSP_IBT_ORDER_ADJ.IBTHeader_IBTItems">\n'
			 	    	+'<m:inline>\n'
			 	    	+'<atom:feed>';
 	    var footer='</atom:feed>'
 	    			+'</m:inline>\n'
 	    			+'</atom:link>\n'
 	    			+'</atom:entry>';
 	   $('.levelThree').each(function(i){
			var element=$(this);
			article=element.find(".articleNo").text();
			var itemNo=element.find('.receivedItemNo').val();
			alreadyReceivedQty=element.find('.received-qty').val();
			orderedQty=element.find('.ordered-qty').text();
			toBeReceivedQty=orderedQty-alreadyReceivedQty;
			ordMul=element.find('.packSize').val();
 			body =body+'<atom:entry>\n'
				          +'<atom:content type="application/xml">\n'
				          +'<m:properties>\n'
				          +'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
				          +'<d:IV_ITEM_NO>'+itemNo+'</d:IV_ITEM_NO>\n'
				          +'<d:IV_ARTICLE>'+article+'</d:IV_ARTICLE>\n'
				          +'<d:IV_ADJUSTED_QTY>'+alreadyReceivedQty+'</d:IV_ADJUSTED_QTY>\n'
				          +'<d:IV_MVT_TYPE>251</d:IV_MVT_TYPE>\n'
				          +'<d:IV_RECV_STORE>'+site+'</d:IV_RECV_STORE>\n'
				          +'</m:properties>\n'
				          +'</atom:content>\n'
				          +'</atom:entry>';
 		});
 		 inputStr =header+body+footer;
 		localStorage['receivedInvoice']=true;
 		 //console.log('inputStr : ', inputStr);
 		receiveOrderTokenUri =directUriPrefix+"ZSP_IBT_ORDER_ADJ";
 		//receiveOrderTokenUri =uriPrefix+"ZSP_IBT_ORDER_ADJ";
 		receiveOrderUri = directUriPrefix+"ZSP_IBT_ORDER_ADJ/IBTHeaders";
 		//receiveOrderUri = uriPrefix+"ZSP_IBT_ORDER_ADJ/IBTHeaders";
 		getReceiveOrderToken(inputStr,receiveOrderTokenUri,receiveOrderUri);
    	
    	}
    	else{
    		var Z ="";
     		var invoiceFlag = localStorage['invoiceFlag'];
     		var docketNo = localStorage['docketNumber'];
     		if(invoiceFlag == "invoice" && invoiceFlag != undefined){
     			addInvoiceInputStr(orderNo,site,date,vendor);
     			
    		
     		};
     		if(invoiceFlag == "docket" && invoiceFlag != undefined){
     			
     			localStorage['receivedInvoice']="true";
     			Z ="<d:IV_DELV_DOCKET>"+docketNo+"</d:IV_DELV_DOCKET>";
     			console.log(Z);
     		}
	    var header='<?xml version="1.0" encoding="utf-8"?>\n'
	    	+'<atom:entry xml:lang="en" xmlns:atom="http://www.w3.org/2005/Atom"\n'
	    	+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
	    	+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
	    	+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
	    	+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_ADD_INV_ORDR_RECEIVE/">\n'
	    	+'<atom:content type="application/xml">\n'
	    	+'<m:properties>\n'
	    	+'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
	    	+'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
	    	+'<d:IV_DATE>'+date+'</d:IV_DATE>\n'
	    	+'<d:IV_VENDOR>'+vendor+'</d:IV_VENDOR>\n'
	    	+Z 
	    	+'</m:properties>\n'
	    	+'</atom:content>\n'
	    	+'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/OrderItems"\n'
	    	+'type="application/atom+xml;type=feed"\n'
	    	+'title="ZSP_ORDER_RCV_SRVC.OrderHeader_OrderItems">\n'
	    	+'<m:inline>\n'
	    	+'<atom:feed>\n';
	    var footer='</atom:feed>'
	    			+'</m:inline>\n'
	    			+'</atom:link>\n'
	    			+'</atom:entry>';
		$('.levelThree').each(function(i){
			console.log($(this).hasClass('deleted'), $(this).is(':visible'), $(this).find(".articleNo").text());
			if(!($(this).hasClass('deleted'))){
			var element=$(this);
			article=element.find(".articleNo").text();
			var itemNo=element.find('.receivedItemNo').val();
			alreadyReceivedQty=element.find('.received-qty').val();
			orderedQty=element.find('.ordered-qty').text();
			toBeReceivedQty=orderedQty-alreadyReceivedQty;
			if($(this).hasClass('added')){
				toBeReceivedQty=0;
			}
			ordMul=element.find('.packSize').val();
			console.log('ordMul: ', ordMul);
			body =body+'<atom:entry>\n'
		          +'<atom:content type="application/xml">\n'
		          +'<m:properties>\n'
		          +'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
		          +'<d:IV_ITEM_NO>'+itemNo+'</d:IV_ITEM_NO>\n'
		          +'<d:IV_ARTICLE>'+article+'</d:IV_ARTICLE>\n'
		          +'<d:IV_ALREADY_RECEIVED_QTY>'+alreadyReceivedQty+'</d:IV_ALREADY_RECEIVED_QTY>\n'
		          +'<d:IV_TO_BE_RECEIVED_QTY>'+toBeReceivedQty+'</d:IV_TO_BE_RECEIVED_QTY>\n'
		          +'<d:IV_ORD_MUL>'+ordMul+'</d:IV_ORD_MUL>\n'
		          +'</m:properties>\n'
		          +'</atom:content>\n'
		          +'</atom:entry>\n';
			}
		});
		 inputStr =header+body+footer;
		 console.log('inputStr : ', inputStr);
		 receiveOrderTokenUri = directUriPrefix+"ZSP_ORDER_RCV";
		 //receiveOrderTokenUri = uriPrefix+"ZSP_ORDER_RCV";
		 receiveOrderUri=directUriPrefix+"ZSP_ORDER_RCV/OrderHeaders";
		 //receiveOrderUri=uriPrefix+"ZSP_ORDER_RCV/OrderHeaders";
		 getReceiveOrderToken(inputStr,receiveOrderTokenUri,receiveOrderUri);
    }}
}
function getReceiveOrderToken(inputStr,receiveOrderTokenUri,receiveOrderUri){
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getReceiveOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : receiveOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getReceiveOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			receiveOrder(header_xcsrf_token, inputStr,receiveOrderUri);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}
/*Function for getting token for Updating order which are in open state*/
function getOpenOrderUpdateToken(inputStr){
	var getOpenOrderUpdateTokenUri = directUriPrefix+"ZSP_DELIVERY_DATE_UPDATE/";
	//var getOpenOrderUpdateTokenUri = uriPrefix+"ZSP_DELIVERY_DATE_UPDATE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getOpenOrderUpdateTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getOpenOrderUpdateTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getOpenOrderUpdateTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			openOrderUpdate(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
		}
	);
}
/*Function for making odata request for Updating order which are in open state*/
function openOrderUpdate(token,inputStr){
	var openOrderUpdateUri =  directUriPrefix+"ZSP_DELIVERY_DATE_UPDATE/DELDATE";
	//var openOrderUpdateUri =  uriPrefix+"ZSP_DELIVERY_DATE_UPDATE/zsp_delivery_date_updateCollection";
	$.ajax({
		url: openOrderUpdateUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', token);	
		},
		dataType: "xml",
		data:inputStr,
		contentType: "application/atom+xml",
		success:function(data,response){
		console.log("Open Order update successful.");
			$('#success-popup, .overlay').fadeIn();
			centerAlign('#success-popup');
		},
	   error :function(err){
		   $('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Delivery Date update');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
		console.log("Open order update failed.",err);
		
	}
	});
	
	
}

function receiveOrder(header_xcsrf_token, inputData ,receiveOrderUri){

	$('.loader').fadeIn();
	console.log('In receiveOrder : ', header_xcsrf_token, inputData);
	if(localStorage['fromOrderlist'] == "true"){
		localStorage['fromOrderlist']=false;
	}
	console.log("receiveOrderUri",receiveOrderUri);
	$.ajax({
		url: receiveOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
	
		success :function (data, response){
			console.log("success");
			if($(data).find('IV_MSG').text().length==0){
				if(localStorage['RO_tempCheckFlag']=='true'){
					grTempUpdateToken();
				}else{
					var receivedInvoiceFlag= localStorage['receivedInvoice'];
					if(receivedInvoiceFlag == "true"){
						delete localStorage['invoiceNo'];
						delete localStorage['invoiceTotal'];
						delete localStorage['gst'];
						delete localStorage['docketNumber'];
						localStorage['receivedInvoice']="false";
						localStorage['fromAdvSearchPage']='false';
						localStorage['firstTimeSearch']='true';
						localStorage['successReceive']='true';
						$('.loader').fadeOut();
						$('#one-button-popup .head-title').text('Success');
						$('#one-button-popup #popup-msg').text('Order Received successfully');
						$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
						$('.overlay, #one-button-popup').fadeIn();
						centerAlign('#one-button-popup');
						
					}
					else{
						$('.loader').fadeOut();
						$('#one-button-popup .head-title').text('Error');
						$('#one-button-popup #popup-msg').text('Server not responding');
						$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
						$('.overlay, #one-button-popup').fadeIn();
						centerAlign('#one-button-popup');
						
					}
				}
			}else{
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				$('#one-button-popup #popup-msg').text('Order not received. SAP Error - '+$(data).find('IV_MSG').text());
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}
		},
		error :function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Order Receive');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	});
}
/*------------------------ Order Receive Service ends ------------------------*/

/*------------------------ Order Cancel Service starts ------------------------*/

function confirmCancelOrder(){
	$('#two-button-popup').fadeOut();
	console.log('Cancelling Order!');
	$('.overlay, .loader').fadeIn();
	var orderNumber=localStorage['orderNo'];
	var site=localStorage['site'];
	var inputStr={
			IV_PO_NO : orderNumber,
			IV_SITE : site
		
	};
	console.log('Cancelling Order : ', inputStr);
	getCancelOrderToken(inputStr);
}
function getCancelOrderToken(inputStr){
	var getCancelOrderTokenUri = directUriPrefix+"ZSP_ORDER_CANCELLATION/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getCancelOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getCancelOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getCancelOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			cancelOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}

function cancelOrder(header_xcsrf_token, inputData){
	var cancelOrderUri=directUriPrefix+"ZSP_ORDER_CANCELLATION/POCancel";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	var cancelOrderHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : cancelOrderUri, // OData endpoint URI
		method : "POST",
		data : inputData
	};
	console.log(cancelOrderHeader);
	OData.request(cancelOrderHeader,
		function (data, response){
			if(data.IV_MSG.length==0){
				console.log("success");
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Success');
				$('#one-button-popup #popup-msg').text('Order Cancelled Successfully');
				$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}else{
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				$('#one-button-popup #popup-msg').text('Order cancellation failed. SAP ERROR - '+data.IV_MSG);
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
				console.log("Error! No response received.", err.message);
			}
			
		},function(err) {
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
			console.log("Error! No response received.", err.message);
		}
	);
}
/*------------------------ Order Cancel Service ends ------------------------*/
/*------------------------Send IBT Service starts ------------------------*/

function confirmSendIbtOrder(){
	console.log('Sending IBT!');
	$(".loader,.overlay").fadeIn();
	var orderNumber=localStorage['orderNo'];
	//var site=localStorage['site'];
	var inputStr="<?xml version='1.0' encoding='utf-8' standalone='yes'?>\n"
				+"<atom:entry xml:lang='en'  xmlns:atom='http://www.w3.org/2005/Atom'\n"
				+"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices'\n"
				+"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'\n"
				+"xmlns:sap='http://www.sap.com/Protocols/SAPData' \n"
				+"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_ORDER_GI/'>\n"
				+"<atom:content type='application/xml'>\n"
				+"<m:properties>\n" 
				+"<d:IV_PO_NO >"+orderNumber+"</d:IV_PO_NO > \n"
				+"</m:properties>\n" 
				+"</atom:content>\n"
				+"</atom:entry>";
	getSendIbtOrderToken(inputStr);
}

function getSendIbtOrderToken(inputStr){
	var getSendIbtOrderTokenUri = directUriPrefix+"ZSP_IBT_ORDER_GI/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getSendIbtOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getSendIbtOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getSendIbtOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			$('.overlay, .loader').fadeIn();
			sendIbtOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}

function sendIbtOrder(header_xcsrf_token, inputData){
	$('.overlay, .loader').fadeIn();
	var sendIbtOrderUri=directUriPrefix+"ZSP_IBT_ORDER_GI/IBT_GI";
	$.ajax({
		url: sendIbtOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			var msg=$(data).find('IV_MSG').text();
			if(msg.trim().length>3){
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				$('#one-button-popup #popup-msg').text('IBT sending failed due to SAP Error - '+msg);
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
				console.log("Error! No response received.", err.message);
			}else{
				console.log("success");
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Success');
				$('#one-button-popup #popup-msg').text('IBT Order sent successfully ');
				$('#one-button-popup #OK').attr('onclick',"localStorage['fromAdvSearchPage']='false';localStorage['firstTimeSearch']='true';" +
						"localStorage['successReceive']='true';" +
						"localStorage['pageId']='viewOrder';" +
						"window.location='viewOrder.html';");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}
			
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
			console.log("Error! No response received.", err.message);
		}
	
	});

}
/*------------------------ Send IBT Service ends ------------------------*/
/*------------------------Create Purchace Order Service starts ------------------------*/

function createPurchaseOrder(){
	console.log('Create Purchace Order Service');
	$(".loader,.overlay").fadeIn();
	var prNumber=localStorage['orderNo'];
	var site=localStorage['site'];
	var vendor=localStorage['sendingStore'];
	var orderType='ZNB';
	
	
	var inputStr="<?xml version='1.0' encoding='utf-8'?>"+
				"<atom:entry xmlns:atom='http://www.w3.org/2005/Atom'" +
				" xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices'" +
				" xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' " +
				"xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
				"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PR_TO_PO/'>" +
				"<atom:content type='application/xml'>" +
				" <m:properties>" +
				"<d:IV_PR_NO>"+prNumber+"</d:IV_PR_NO>" +
				"<d:IV_SITE>"+site+"</d:IV_SITE>" +
				"<d:IV_VENDOR>"+vendor+"</d:IV_VENDOR>" +
				"<d:IV_DOC_TYPE>"+orderType+"</d:IV_DOC_TYPE>" +
				"</m:properties>" +
				" </atom:content>" +
				"</atom:entry>";
	getCreatePurchaseOrderToken(inputStr);
}
function getCreatePurchaseOrderToken(inputStr){
	var getCreatePurchaseOrderTokenUri = directUriPrefix+"ZSP_PR_TO_PO/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getCreatePurchaseOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getCreatePurchaseOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getCreatePurchaseOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			convertPurchaseOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
		}
	);
}

function convertPurchaseOrder(header_xcsrf_token, inputData){
	var purchaseOrderUri=directUriPrefix+"ZSP_PR_TO_PO/PR_TO_PO";
	console.log("purchaseOrderUri",purchaseOrderUri);
	$.ajax({
		url: purchaseOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			var msg=$(data).find("IV_MSG").text();
			var orderNumber=$(data).find("IV_ORDER_NO").text();
			if(msg == ""){
			
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Order Detail');
			$('#cancel-order-status #popup-msg').text('Transaction successful. Order No : '+orderNumber);
			$('#cancel-order-status #OK').attr('onclick',"localStorage['fromAdvSearchPage']='false';localStorage['firstTimeSearch']='true';" +
					"localStorage['successReceive']='true';" +
					"localStorage['pageId']='viewOrder';" +
					"window.location='viewOrder.html';");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			}
			else{
				
				$('.loader').fadeOut();
				$('#cancel-order-status .head-title').text('Update Purchase Requistion Detail');
				$('#cancel-order-status #popup-msg').text('PO Conversion failed in SAP - '+msg);
				$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
				$('.overlay, #cancel-order-status').fadeIn();
				centerAlign('#cancel-order-status');
			}
			
			
			
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	
	});

}
/*------------------------ Create Purchace Order Service ends ------------------------*/
/*------------------------Edit Purchace Order Service starts ------------------------*/

function editPurchaseOrder(){
	console.log('Edit Purchace Order Service');
	$(".loader,.overlay").fadeIn();
	var prNumber=localStorage['orderNo'];
	var site=localStorage['site'];
	var vendor=localStorage['sendingStore'];
	var body='';
	//var orderType='ZNB';
	 var header="<?xml version='1.0' encoding='utf-8'?>" +
	 			"<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' " +
	 			"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices'" +
	 			" xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'" +
	 			" xmlns:sap='http://www.sap.com/Protocols/SAPData'" +
	 			" xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PREQ_CHANGE/'>" +
	 			"<atom:content type='application/xml'>" +
	 			"<m:properties>" +
	 			"<d:IV_PREQ_NO>"+prNumber+"</d:IV_PREQ_NO>" +
	 			"<d:IV_SITE>"+site+"</d:IV_SITE>" +
	 			"</m:properties>" + 
	 			"</atom:content>" +
	 			"<atom:link rel='http://schemas.microsoft.com/ado/2007/08/dataservices/related/PReqItems' " +
	 			"type='application/atom xml;type=feed'  title='ZSP_PREQ_CHANGE.PReqHeader_PReqItem'>" +
	 			"<m:inline>" +
	 			"<atom:feed>";
	    var footer='</atom:feed>'
	    			+'</m:inline>\n'
	    			+'</atom:link>\n'
	    			+'</atom:entry>';
	    var unsavedFlag=false;
	    localStorage['AA_NoOfItems_initial']=$('.levelThree').length;
		$('.levelThree').each(function(i){
			var element=$(this);
			var updateOrDeleteFlag='U';
			if(element.hasClass('deleted') &&  element.hasClass('added')){
				updateOrDeleteFlag='skip';
			}else if(element.hasClass('deleted')){
				updateOrDeleteFlag='D';
			}else if(element.hasClass('added')){
				updateOrDeleteFlag='I';
			}
			if(element.is(':visible') && element.hasClass('unsaved'))
			unsavedFlag=true;

			var article=element.find(".articleNumber").text();
			var itemNo=element.find('.articleItemNo').val();
			var uom=element.find('.uom').text();
			var om=parseFloat(element.find('.om').html());
			//uom='CAR';
			console.log('UOM : ', uom);
			orderedQty=parseFloat(element.find('.editQrdQty').val());
			totalOrderedQty=orderedQty*om;
			console.log('Qty : ', orderedQty, ' Tot : ', totalOrderedQty, 'om : ', om);
			deliveryDate=element.find('.editDelDate').val();
			delDateArray=deliveryDate.split("-");
			delDate=delDateArray[0]+delDateArray[1]+delDateArray[2];
			console.log('delDate : ', delDate);
			ordMul=element.find('.packSize').val();
			if(updateOrDeleteFlag!='skip'){
				body =body+ "<atom:entry>" +
						"<atom:content type='application/xml'>" +
						"<m:properties>" +
						" <d:IV_PREQ_NO>"+prNumber+"</d:IV_PREQ_NO>" +
						"<d:IV_ITEM_NO>"+itemNo+"</d:IV_ITEM_NO>" +
						" <d:IV_ARTICLE>"+article+"</d:IV_ARTICLE>" +
						"<d:IV_QTY>"+totalOrderedQty+"</d:IV_QTY>" +
						"<d:IV_UOM>"+uom+"</d:IV_UOM>" +
						"<d:IV_VENDOR>"+vendor+"</d:IV_VENDOR>" +
						"<d:IV_DELV_DATE>"+delDate+"</d:IV_DELV_DATE>" +
						"<d:IV_SITE>"+site+"</d:IV_SITE>" +
						"<d:IV_FLAG>"+updateOrDeleteFlag+"</d:IV_FLAG>" +
						"</m:properties>" +
						"</atom:content>" +
						"</atom:entry>" ;
			}
					
		});
		 inputStr =header+body+footer;
		 console.log('inputStr : ', inputStr);
if(unsavedFlag==true){
$(".loader,.overlay").fadeOut();
$('#error-popup .head-title').text('Unsaved Items');
			$('#error-popup #popup-msg').text('Please save the changes before update');
			$('#error-popup #OK').attr('onclick',"$('#error-popup, .overlay').fadeOut();");
			centerAlign('#error-popup');
			$('#error-popup, .overlay').fadeIn();
							
							$('#OK').click(function(e){
								$('#error-popup, .overlay').fadeOut();
								setTimeout(function(){$('.unsaved:first-child').find('.editFields:first-child').focus();},50);
								});

}else{
$(".loader,.overlay").fadeIn();
	getEditPurchaseOrderToken(inputStr);
}
}
function getEditPurchaseOrderToken(inputStr){
	var getEditPurchaseOrderTokenUri = directUriPrefix+"ZSP_PREQ_CHANGE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getEditPurchaseOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getEditPurchaseOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getEditPurchaseOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			purchaseOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
		}
	);
}

function purchaseOrder(header_xcsrf_token, inputData){
	var purchaseOrderUri=directUriPrefix+"ZSP_PREQ_CHANGE/PReqHeaders";
	$.ajax({
		url: purchaseOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			var msg=$(data).find("IV_MSG").text();
			if(msg == ""){
			console.log(data);
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Update Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Purchase Requistion detail updated successfully ');
			$('#cancel-order-status #OK').attr('onclick',"localStorage['pageId']='orderDetail';window.location='orderDetail.html';");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			if(wool.tableExists("OrderArticleTable")){
				wool.deleteRows('OrderArticleTable');
				wool.commit();
			}
			}
			else{
				
				$('.loader').fadeOut();
				$('#cancel-order-status .head-title').text('Update Purchase Requistion Detail');
				$('#cancel-order-status #popup-msg').text('Purchase Order creation failed due to SAP error - \n'+msg);
				$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
				$('.overlay, #cancel-order-status').fadeIn();
				centerAlign('#cancel-order-status');
			}
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	
	});

}
/*------------------------ Edit Purchace Order Service ends ------------------------*/
/*------------------------ Add Invoice  Service starts ------------------------*/
function addInvoiceInputStr(orderNo,site,date,vendor){
	//var vendorNote = "";
	var vendorNote = localStorage['invoiceNo'];
	var invoiceTotal = localStorage['invoiceTotal'];
	var gstTotal = localStorage['gst'];
	var inputStr='<?xml version=\'1.0\' encoding=\'utf-8\' standalone=\'yes\'?> \n'
			+'<atom:entry xml:lang=\'en\'  xmlns:atom=\'http://www.w3.org/2005/Atom\' \n'
			+'xmlns:d=\'http://schemas.microsoft.com/ado/2007/08/dataservices\' \n'
			+'xmlns:m=\'http://schemas.microsoft.com/ado/2007/08/dataservices/metadata\' \n'
			+'xmlns:sap=\'http://www.sap.com/Protocols/SAPData\' \n'
			+'xml:base=\'http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_INVOICE_CREATE/\'>\n'
			+'<atom:content type=\'application/xml\'> \n'
			+'<m:properties> \n'
			+'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
			+'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
			+'<d:IV_DATE>'+date+'</d:IV_DATE>\n'
			+'<d:IV_VENDOR_NO>'+vendor+'</d:IV_VENDOR_NO>\n'
			+'<d:IV_VENDOR_NOTE>'+vendorNote+'</d:IV_VENDOR_NOTE>\n'
			+'<d:IV_INVOICE_TOTAL>'+invoiceTotal+'</d:IV_INVOICE_TOTAL>\n'
			+'<d:IV_GST_TOTAL>'+gstTotal+'</d:IV_GST_TOTAL>\n'
			+'</m:properties>\n'
			+'</atom:content>\n'
			+'</atom:entry>';
	console.log("AddInvoice Uri:--",inputStr);
	getAddInvoiceToken(inputStr);
}
function getAddInvoiceToken(inputStr){
	//var getAddInvoiceTokenUri = uriPrefix+"ZSP_INVOICE_CREATE/";
	var getAddInvoiceTokenUri= "http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_INVOICE_CREATE";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getAddInvoiceTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getAddInvoiceTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getAddInvoiceTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			addInvoice(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
		}
	);
}

function addInvoice(header_xcsrf_token, inputData){
	var addInvoiceUri=directUriPrefix+"ZSP_INVOICE_CREATE/InvcCreate";
	//var addInvoiceUri="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_INVOICE_CREATE/InvcCreate";
	$.ajax({
		url: addInvoiceUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("success");
			localStorage['receivedInvoice']="true";
			console.log("Invoice successfully submitted");
			
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	
	});
/*	OData.request(addInvoiceHeader,
		function (data, response){
			console.log("success");
			$('.loader').fadeOut();
			var flag= localStorage['receivedInvoice'];
			if(flag == "yes"){
			localStorage['pageId']='viewOrder';
			window.location='viewOrder.html';
			}
		},function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	);*/
}











/*------------------------Add Invoice  Service ends ------------------------*/

/*------------------------ Save And Exit starts ------------------------*/

function saveAndExit(){
	localStorage['orderDetails-firstClick']='false';
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var orderType=localStorage['orderType'];
	console.log('orderType : "', orderType,'"');
	var orderTypePrefix='';
	if(orderType.trim()=='IBT'){
		orderTypePrefix='.ibt-details';
	}else{
		orderTypePrefix='.other-details';
	}
	var orderNo=$(orderTypePrefix+' .orderNo').text().trim();
	var vendor=$(orderTypePrefix+' .vendor').text().trim();
	var tradingDept =$(orderTypePrefix+' .trading-dept').text().trim(); 
	var temperature=$(orderTypePrefix+' .temperature').val(); 
	var cartonsNo=$(orderTypePrefix+' .total-cartons').text().trim(); 
	var invoiceNo=''; 
	var invoiceTotal='';
	var gst='';
	var deliveryDocNo='';
	if(orderType.trim()!='IBT'){
		invoiceNo=$(orderTypePrefix+' .other-invoiceNumber').val();
		invoiceTotal=$(orderTypePrefix+' .other-invoiceTotal').val();
		gst=$(orderTypePrefix+' .other-gst').val();
		deliveryDocNo=$(orderTypePrefix+' .other-docketNumber').val();
	}
	var sendingStore=$(orderTypePrefix+' .sending-store').text().trim();
	var receivingStore=$(orderTypePrefix+' .receiving-store').text().trim();
	var value=$(orderTypePrefix+' .value').val();
	if(typeof value == 'undefined'){
		value='';
	}
	console.log('orderNo : ',orderNo, 'orderType : ', orderType, 'vendor : ',vendor, 'tradingDept : ',tradingDept ,'temperature : ', temperature, 'cartonsNo : ',cartonsNo, 'invoiceNo : ',invoiceNo, 'invoiceTotal : ',invoiceTotal, 'gst : ',gst, 'deliveryDocNo : ',deliveryDocNo, 'sendingStore : ',sendingStore, 'receivingStore : ',receivingStore, 'value : ',value);
	insertIntoViewOrderDetailsTable(orderNo, orderType, vendor, tradingDept , temperature, cartonsNo, invoiceNo, invoiceTotal, gst, deliveryDocNo, sendingStore, receivingStore, value);
	$('.received').each(function(){
		var element=$(this);
		var receivedFlag='true';
		var article=element.attr('data-itemnumber');
		var itemNo=element.find('.article').val();
		var itemDesc=element.find('.description').text();
		var packSize=element.find('.packSize').text();
		var orderedQty=element.find('.ordered-qty').text();
		var receivedQty=element.find('.received-qty').val();
		insertIntoViewOrderDetailItemsTable(orderNo, receivedFlag, article, itemNo, itemDesc , packSize, orderedQty, receivedQty);
	});
	$('.not-received').each(function(){
		var element=$(this);
		var receivedFlag='false';
		var article=element.attr('data-itemnumber');
		var itemNo=element.find('.item-no').val();
		var itemDesc=element.find('.description').text();
		var packSize=element.find('.packSize').text();
		var orderedQty=element.find('.ordered-qty').text();
		var receivedQty=element.find('.received-qty').val();
		insertIntoViewOrderDetailItemsTable(orderNo, receivedFlag, article, itemNo, itemDesc , packSize, orderedQty, receivedQty);
	});
	localStorage['pageId']='viewOrder';
	window.location='viewOrder.html';
}

/*------------------------ Save And Exit ends ------------------------*/

/* ---------------------------------- ibt validation starts ---------------------------------- */

function ibtSendNow(){ 
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var headerPartOne='<?xml version="1.0" encoding="utf-8"?>\n'
		+'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"\n'
		+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
		+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
		+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
		+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_ORDER_CREATE/">\n'
		+'<atom:content type="application/xml">\n'
		+'<m:properties>\n';
	var headerPartTwo='</m:properties>\n'
		+'</atom:content>\n'
		+'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/OrderItems"\n'
		+'type="application/atom+xml;type=feed"\n'
		+'title="ZSP_IBT_ORDER_CREATE.OrderHeader_OrderItems">\n'
		+'<m:inline>\n'
		+'<atom:feed>\n';
	var footer='</atom:feed>\n'
		+'</m:inline>\n'
		+'</atom:link>\n'
		+'</atom:entry>\n';
	var articleDetails='';
	var siteDetails='';
	$.each($('.order-list-item'),function(){
		var currentDate = new Date();
		var site=localStorage['site'];
		currentDate=currentDate.toISOString().slice(0,10).replace(/-/g,"");
		var siteNo=$(this).find('.vendorNo').val();
		console.log('siteNo : ', siteNo);
		siteDetails='<d:IV_SUPP_SITE>'+site+'</d:IV_SUPP_SITE>\n'
						+'<d:IV_SITE>'+siteNo+'</d:IV_SITE>\n';
		
		var itemNo=$(this).find('.articleNo').text();
		console.log('Item No : ', itemNo);
		var description=$(this).find('.description').text();
		console.log('Desc : ', description);
		var qty=$(this).find('.qtyDisp').text();
		var deliveryDate=$(this).find('.delviDate').text();
		deliveryDate=deliveryDate.split('-')[0]+deliveryDate.split('-')[1]+deliveryDate.split('-')[2];
		var uom=$(this).find('.uom-value').val();
		if($(this).find('.ibtDrop ').val()=='stdCarton'){
			uom='CAR';
		}
		console.log('Qty : ', qty);
		console.log('Uom : ', uom);
		console.log('deliveryDate : ', deliveryDate);
		articleDetails=articleDetails+'<atom:entry>\n'
				+'<atom:content type="application/xml">\n'
				+'<m:properties>\n'
				+'<d:IV_SUPP_SITE>'+site+'</d:IV_SUPP_SITE>\n'
				+'<d:IV_ARTICLE>'+itemNo+'</d:IV_ARTICLE>\n'
				+'<d:IV_QTY>'+qty+'</d:IV_QTY>\n'
				+'<d:IV_UOM>'+uom+'</d:IV_UOM>\n'
				+'<d:IV_DEL_DATE>'+deliveryDate+'</d:IV_DEL_DATE>\n'
				+'</m:properties>\n'
				+'</atom:content>\n'
				+'</atom:entry>\n';
	});
	var requestXML=headerPartOne+siteDetails+headerPartTwo+articleDetails+footer;
	console.log(requestXML);
	getIbtToken(requestXML);
}
function getIbtToken(inputStr){
	console.log('Getting token -  Order');
	var placeOrderTokenUri = directUriPrefix+"ZSP_IBT_ORDER_CREATE/";
	//var placeOrderTokenUri = uriPrefix+"ZSP_IBT_ORDER_CREATE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var placeOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : placeOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(placeOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			placeIbt(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		}
	);
}

function placeIbt(header_xcsrf_token, inputData){
	console.log(inputData);
	//var placeOrderUri=directUriPrefix+"ZSP_IBT_ORDER_CREATE/OrderHeaders";
	var placeOrderUri=directUriPrefix+"ZSP_IBT_ORDER_CREATE/OrderHeaders";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	
	console.log("Header fields : ", oHeaders);
	var placeOrderHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : placeOrderUri, // OData endpoint URI
		method : "POST",
		data : inputData
	};
	console.log(placeOrderHeader);
	$.ajax({
		url: placeOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("Success! ");
			console.log(response);	
			console.log(data);	
				flag=true;
				console.log(response.statusCode);
				console.log(response.statusText);
				var msg=$(data).find("IV_MSG").text();
				if(msg==''){
					wool.deleteRows('IBTListTable');
					wool.commit();
					var orderNumber=$(data).find("IV_ORDER_NO").text();
					clearOrders();
					$('.srch-rslt-list').html('');
					$('#no-of-items').text('0');
					$('.loader').fadeOut(300); 
					$('.to-store').text(localStorage['searchSupplier_ibt']);
					$('.to-store-name').text(localStorage['searchSupplierName_ibt']);
					$('.from-store').text(localStorage['site']);
					$('.from-store-name').text(localStorage['siteName']);
					var date = new Date();
					var day = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ][date.getDay()];
					var today=day+" "+date.getDate()+"/"+((parseInt(date.getMonth()))+1)+"/"+date.getUTCFullYear();
					$('.req-date').text(today);
					$('.ibt-no').text(orderNumber);
					$('.total-value').text("$ "+parseFloat(localStorage['OL_totalValue']).toFixed(2));
					localStorage['SL_toStore']=localStorage['searchSupplier_ibt'];
					localStorage['SL_toStoreName']=localStorage['searchSupplierName_ibt'];
					localStorage['SL_orderNumber']=orderNumber;
					localStorage['SL_totalValue']=localStorage['OL_totalValue'];
					$('#ibt-success-popup, #overlay').fadeIn();
					centerAlign('#ibt-success-popup');
					$('#ibt-success-popup ').height((window.innerHeight)-2);
					$('#ibt-success-popup ').width((window.innerWidth)-2);
				}else{
					$('.loader').fadeOut(300); 
					$('#error-popup .head-title').text('Error');
					$('#error-popup .popup-msg').text('Transfer failed. '+msg);
					$('#error-popup .ok').attr('onclick',"$('#error-popup,.overlay').fadeOut(500);");
					$('#error-popup, #overlay').fadeIn();
					centerAlign('#error-popup');
				}
			},
		error:  function(err) {
			if(err.status=='400'){
				$('#error-popup .popup-msg').text('Order creation failed. OM should be greater than zero');
			}else{
				$('#error-popup .popup-msg').text('Server not responding');
			}
			$('.loader').fadeOut(300);
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
			console.log("Error! No response received.", err.message, err.status);
		}
	
	});
} 

/* ---------------------------------- ibt validation ends ---------------------------------- */
/* ---------------------------------- Docket and invoice starts ---------------------------------- */


function getDocketFinalise(){ 
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var iv_operation ="";
	var orderNo=$('.other-details .orderNo').text();
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
	var currentDay=('0' + currentDate.getDate()).slice(-2);
	var date=currentYear+currentMonth+currentDay;
	var vendor=localStorage['supplierNo'];
	var delDocketNo=$(".other-docketNumber").val();
	var gstTotal=$(".other-gst").val();
	var invoice_no=$(".other-invoiceNumber").val();
	var invoiceTotal=$(".other-invoiceTotal").val();
	var order_received='X';
	var requestFlag ;
	if (delDocketNo == ""){
		requestFlag ='<d:IV_INVOICE_NO>'+invoice_no+'</d:IV_INVOICE_NO>\n'
	        +'<d:IV_INVOICE_TOATL>'+invoiceTotal+'</d:IV_INVOICE_TOATL>\n'
	        +'<d:IV_GST_TOTAL>'+gstTotal+'</d:IV_GST_TOTAL>';
	}
	else{
		
		requestFlag = '<d:IV_DELV_DOCKET>'+delDocketNo+'</d:IV_DELV_DOCKET>\n';
	}
	var body="";
	//console.log("order_rcvd_flag : ", order_rcvd_flag);
	var header='<?xml version="1.0" encoding="utf-8"?>\n'
		+'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"\n'
		+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
			+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
			+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
			+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_ORDER_RCV_SRVC/">\n'
			  +'<atom:content type="application/xml">\n'
			    +'<m:properties>\n'
			      +'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
			      +'<d:IV_SITE>'+site+'</d:IV_SITE>\n'
			      +'<d:IV_DATE>'+date+'</d:IV_DATE>\n'
			      +'<d:IV_VENDOR>'+vendor+'</d:IV_VENDOR>\n'
			      +'<d:IV_ORDER_RECEIVED>'+order_received+'</d:IV_ORDER_RECEIVED>\n'
			      +'<d:IV_OPERATION>'+iv_operation+'</d:IV_OPERATION>\n'
			      +requestFlag
			      +'</m:properties>\n'
			  +'</atom:content>\n'
			 +'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/OrderItems"\n'
			  +'type="application/atom+xml;type=feed"\n'
			  +'title="ZSP_ORDER_RCV_SRVC.OrderHeader_OrderItems">\n'
			    +'<m:inline>\n'
			    +'<atom:feed>\n';

	var footer='</atom:feed>\n'
		+'</m:inline>\n'
		+'</atom:link>\n'
		+'</atom:entry>\n';

		$('.new').each(function(i){
			var element=$(this);
			article=element.attr('data-itemnumber');
			var r=element.find('.item-no').val();
			if(r==""){
			itemNo ="00020";
			}
			else{
			itemNo=r;
			}
			alreadyReceivedQty=element.find('.received-qty').val();
			orderedQty=element.find('.ordered-qty').text();
			toBeReceivedQty=orderedQty-alreadyReceivedQty;
			k=element.find('.packSize').text();
			if(k==""){
			ordMul=element.find('.pack-qty').val();
			}
			else{
				ordMul = k;	
			}
			body =body+'<atom:entry>\n'
		          +'<atom:content type="application/xml">\n'
		          +'<m:properties>\n'
		          +'<d:IV_ORDER_NO>'+orderNo+'</d:IV_ORDER_NO>\n'
		          +'<d:IV_ITEM_NO>'+itemNo+'</d:IV_ITEM_NO>\n'
		          +'<d:IV_ARTICLE>'+article+'</d:IV_ARTICLE>\n'
		          +'<d:IV_ALREADY_RECEIVED_QTY>'+alreadyReceivedQty+'</d:IV_ALREADY_RECEIVED_QTY>\n'
		          +'<d:IV_TO_BE_RECEIVED_QTY>'+toBeReceivedQty+'</d:IV_TO_BE_RECEIVED_QTY>\n'
		          +'<d:IV_ORD_MUL>'+ordMul+'</d:IV_ORD_MUL>\n'
		          +'</m:properties>\n'
		          +'</atom:content>\n'
		          +'</atom:entry>\n';
		});
		 inputStr =header+body+footer;
		 console.log('inputStr : ', inputStr); 
		 getDocketOrderToken(inputStr);
}
function getDocketOrderToken(inputStr){
	console.log("inside getDocketOrderToken() ");
	var getDocketOrderTokenUri = directUriPrefix+"ZSP_ADD_INV_ORDR_RECEIVE/";
	//var getDocketOrderTokenUri = uriPrefix+"ZSP_ADD_INV_ORDR_RECEIVE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getDocketOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getDocketOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getDocketOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			updateDocketOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
		}
	);
}

function updateDocketOrder(header_xcsrf_token, inputData){
	console.log('In update docket : ', header_xcsrf_token, inputData);
	var updateDocketOrderUri=directUriPrefix+"ZSP_ADD_INV_ORDR_RECEIVE/OrderHeaders";
	//var updateDocketOrderUri=uriPrefix+"ZSP_ADD_INV_ORDR_RECEIVE/OrderHeaders";
	$.ajax({
		url: updateDocketOrderUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
	
		success :function (data, response){
			console.log("success");
			$('.loader').fadeOut();
			localStorage['pageId']='viewOrder';
			window.location='viewOrder.html';

		},
		error :function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Update Order');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	});
}

/* ---------------------------------- Docket and invoice ends ---------------------------------- */

/* ---------------------------------- Order Quantity -Order and IBT History service starts ---------------------------------- */
function loadArticleOrderHistory(itemNo, orderType){
	console.log('In loadArticleOrderHistory');
	$('.order-history-container').html('');
	var articleOrderHistoryUri;
	var dayAfterTomorrow=new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate()+2);
	var dayBeforeYesterday=new Date();
	dayBeforeYesterday.setDate(dayBeforeYesterday.getDate()-2);
//	var fromDate = dayBeforeYesterday.toISOString().slice(0,10).replace(/-/g,"");
//	var toDate = dayAfterTomorrow.toISOString().slice(0,10).replace(/-/g,"");
	var fromD=new Date();
	fromD.setDate(fromD.getDate()-7);
	var toD=new Date();
	toD.setDate(toD.getDate()+21);
	var fromDate = fromD.toISOString().slice(0,10).replace(/-/g,"");
	var toDate = toD.toISOString().slice(0,10).replace(/-/g,"");
	/*fromDate='20120130';
	toDate='20120203';*/
	console.log('from : ', fromDate, ' to : ', toDate);
	var currentDate=new Date();
	var tomorrow=new Date();
	tomorrow.setDate(tomorrow.getDate()+1);
	var dayAfterTomorrow=new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate()+2);
	var yesterday=new Date();
	yesterday.setDate(yesterday.getDate()-1);
	var dayBeforeYesterday=new Date();
	dayBeforeYesterday.setDate(dayBeforeYesterday.getDate()-2);
	currentDate=('0'+currentDate.getDate()).substr(-2,2)+'.'+('0'+(currentDate.getMonth()+1)).substr(-2,2)+'.'+currentDate.getFullYear();
	console.log('CurrentDate : ', currentDate);
	tomorrow=('0'+tomorrow.getDate()).substr(-2,2)+'.'+('0'+(tomorrow.getMonth()+1)).substr(-2,2)+'.'+tomorrow.getFullYear();
	console.log('tomorrow : ', tomorrow);
	dayAfterTomorrow=('0'+dayAfterTomorrow.getDate()).substr(-2,2)+'.'+('0'+(dayAfterTomorrow.getMonth()+1)).substr(-2,2)+'.'+dayAfterTomorrow.getFullYear();
	console.log('dayAfterTomorrow : ', dayAfterTomorrow);
	yesterday=('0'+yesterday.getDate()).substr(-2,2)+'.'+('0'+(yesterday.getMonth()+1)).substr(-2,2)+'.'+yesterday.getFullYear();
	console.log('yesterday : ', yesterday);
	dayBeforeYesterday=('0'+dayBeforeYesterday.getDate()).substr(-2,2)+'.'+('0'+(dayBeforeYesterday.getMonth()+1)).substr(-2,2)+'.'+dayBeforeYesterday.getFullYear();
	console.log('dayBeforeYesterday : ', dayBeforeYesterday);
	/*
	if(orderType=='ZUB'){
		articleOrderHistoryUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+itemNo+"' and iv_order_type eq '"+orderType+"' and iv_delivery_fromdate eq '"+fromDate+"' and iv_delivery_todate eq '"+toDate+"' and iv_order_status eq 'Open'";
	}else{
		articleOrderHistoryUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+itemNo+"' and iv_delivery_fromdate eq '"+fromDate+"' and iv_delivery_todate eq '"+toDate+"' and iv_order_status eq 'Open'";
	}
	*/
	articleOrderHistoryUri=uriPrefix+"ZSP_PR_ENQ_HEADER/zsp_pr_enq_headerCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+itemNo+"'  and iv_preq_type eq 'ZY'and iv_delivery_fromdate eq '"+fromDate+"' and iv_delivery_todate eq '"+toDate+"'";
	console.log('Order Type : ', orderType,' URI : ', articleOrderHistoryUri);
    var articleOrderHistoryHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: articleOrderHistoryUri, // OData endpoint URI
        method: "GET",
        timeoutMS: 20000
    };
    OData.request(articleOrderHistoryHeader, 
    	function(data,response){
    		console.log('success ', data.results.length);
    		var futureDeliveries='';
    		var pastDeliveries='';
    		var futureCounter=0;
    		var pastCounter=0;
    		var count = 0;
    		var pcount = 0;
    		var itemFoundFlag=false;
    		/*currentDate='03.02.2012';
    		yesterday='30.01.2012';*/
    		for(var i=0; i<data.results.length; i++){
    			var deliveryDate=data.results[i].delivery_date;
    		//	if(deliveryDate==currentDate || deliveryDate == tomorrow || deliveryDate == dayAfterTomorrow){
					var orderNo=data.results[i].preq_no;
					var orderDeliveryDate=data.results[i].delivery_date;
					var orderRosterDate=data.results[i].roster_date;
    				//var status=data.results[i].order_status;
					var orderNoCheck=data.results[i].order_no;
					console.log('PreqNo: ', orderNo, 'OrderNo: ', orderNoCheck );
					if(orderNoCheck == "") {
    				futureDeliveries=futureDeliveries+"<table cellspacing='0' class='order-history-item'>"
										+"<tr>"
										+"<th colspan='2' class='pad2 txtLft borderB'>Order # <span class='orderNo '>"+orderNo+"</span></td>"	
										+"</tr>"
										+"<tr>"
										+"<td colspan='2' class='pad2 borderB'>Roster Date :  <span class='rosterDate'>"+orderRosterDate+"</span></td>"
										+"</tr>"
										+"<tr>"
										+"<td colspan='2' class='pad2'>Delivery Date :  <span class='deliveryDate'>"+orderDeliveryDate+"</span></td>"
										+"</tr>"
										+"</table>";
    				futureCounter++;
    				itemFoundFlag=true;
    				console.log('Counter : ', futureCounter, 'futureDeliveries : ', futureDeliveries);
    				count++;
    				console.log('count: ', count);
					}
    		//	}
    		/*	if(futureCounter==5){
					//return false;
    				break;
				} */
    		}
    		/*for(var i=0; i<data.results.length; i++){
    			var deliveryDate=data.results[i].delivery_date;
    		//	if(deliveryDate == yesterday || deliveryDate == dayBeforeYesterday){
    				var orderNo=data.results[i].preq_no;
					var orderDeliveryDate=data.results[i].delivery_date;
					var orderRosterDate=data.results[i].roster_date;
    				//var status=data.results[i].order_status;
					var orderNoCheck=data.results[i].order_no;
					console.log('PreqNo: ', orderNo, 'OrderNo: ', orderNoCheck );
					if(orderNoCheck == "") {
    				pastDeliveries=pastDeliveries+"<table cellspacing='0' class='order-history-item'>"
										+"<tr>"
										+"<th colspan='2' class='txtLft borderB pad2'>Order # <span class='orderNo '>"+orderNo+"</span></td>"	
										+"</tr>"
										+"<tr>"
										+"<td colspan='2' class='pad2 borderB'>Roster Date :  <span class='rosterDate'>"+orderRosterDate+"</span></td>"
										+"</tr>"
										+"<tr>"
										+"<td colspan='2' class='pad2'>Delivery Date :  <span class='deliveryDate'>"+orderDeliveryDate+"</span></td>"
										+"</tr>"
										+"</table>";
    				pastCounter++;
    				itemFoundFlag=true;
    				console.log('Counter : ', pastCounter, 'pastDeliveries : ', pastDeliveries);
    				count++;
    				console.log('count: ', count);
    				pcount++;
    				console.log('pcount: ', pcount);
					}
    		//	}
    			if(pastCounter==5){
					//return false;
    				break;
				} 
    		}*/
    		if(itemFoundFlag==false){
				noItemFound="<table cellspacing='0' class='order-history-item'>"
							+"<tr>"
							+"<th class='txtCenter pad2'>No Order found</th>"
							+"</tr>"
							+"</table>";
				$('.order-history-container').append(noItemFound);
				console.log('No Item Found');
			}else{
				$('.order-history-container').append(futureDeliveries);
				$('.order-history-container').append(pastDeliveries);
			}
    		refreshScroll();
    		$('.overlay, .loader').fadeOut();
	    },function(err){
	    	console.log(err);
	    	var errorMsg="<table cellspacing='0' class='order-history-item'>"
				+"<tr>"
				+"<th class='txtCenter pad2'>Server not responding</th>"
				+"</tr>"
				+"</table>";
			$('.order-history-container').append(errorMsg);
			console.log('Server not responding');
			refreshScroll();
			$('.overlay, .loader').fadeOut();
	    }
    );
}

/*function loadArticleOrderHistory(itemNo, orderType){
	console.log('In loadArticleOrderHistory');
	$('.order-history-container').html('');
	var articleOrderHistoryUri;
	var dayAfterTomorrow=new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate()+2);
	var dayBeforeYesterday=new Date();
	dayBeforeYesterday.setDate(dayBeforeYesterday.getDate()-2);
	var fromDate = dayBeforeYesterday.toISOString().slice(0,10).replace(/-/g,"");
	var toDate = dayAfterTomorrow.toISOString().slice(0,10).replace(/-/g,"");
	fromDate='20120130';
	toDate='20120203';
	console.log('from : ', fromDate, ' to : ', toDate);
	var currentDate=new Date();
	var tomorrow=new Date();
	tomorrow.setDate(tomorrow.getDate()+1);
	var dayAfterTomorrow=new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate()+2);
	var yesterday=new Date();
	yesterday.setDate(yesterday.getDate()-1);
	var dayBeforeYesterday=new Date();
	dayBeforeYesterday.setDate(dayBeforeYesterday.getDate()-2);
	currentDate=('0'+currentDate.getDate()).substr(-2,2)+'.'+('0'+(currentDate.getMonth()+1)).substr(-2,2)+'.'+currentDate.getFullYear();
	console.log('CurrentDate : ', currentDate);
	tomorrow=('0'+tomorrow.getDate()).substr(-2,2)+'.'+('0'+(tomorrow.getMonth()+1)).substr(-2,2)+'.'+tomorrow.getFullYear();
	console.log('tomorrow : ', tomorrow);
	dayAfterTomorrow=('0'+dayAfterTomorrow.getDate()).substr(-2,2)+'.'+('0'+(dayAfterTomorrow.getMonth()+1)).substr(-2,2)+'.'+dayAfterTomorrow.getFullYear();
	console.log('dayAfterTomorrow : ', dayAfterTomorrow);
	yesterday=('0'+yesterday.getDate()).substr(-2,2)+'.'+('0'+(yesterday.getMonth()+1)).substr(-2,2)+'.'+yesterday.getFullYear();
	console.log('yesterday : ', yesterday);
	dayBeforeYesterday=('0'+dayBeforeYesterday.getDate()).substr(-2,2)+'.'+('0'+(dayBeforeYesterday.getMonth()+1)).substr(-2,2)+'.'+dayBeforeYesterday.getFullYear();
	console.log('dayBeforeYesterday : ', dayBeforeYesterday);
	
	if(orderType=='ZUB'){
		articleOrderHistoryUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+itemNo+"' and iv_order_type eq '"+orderType+"' and iv_delivery_fromdate eq '"+fromDate+"' and iv_delivery_todate eq '"+toDate+"'";
	}else{
		articleOrderHistoryUri=uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+itemNo+"' and iv_delivery_fromdate eq '"+fromDate+"' and iv_delivery_todate eq '"+toDate+"'";
	}
	console.log('Order Type : ', orderType,' URI : ', articleOrderHistoryUri);
    var articleOrderHistoryHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: articleOrderHistoryUri, // OData endpoint URI
        method: "GET",
        timeoutMS: 20000
    };
    OData.request(articleOrderHistoryHeader, 
    	function(data,response){
    		console.log('success ', data.results.length);
    		var futureDeliveries='';
    		var pastDeliveries='';
    		var futureCounter=0;
    		var pastCounter=0;
    		var itemFoundFlag=false;
    		currentDate='03.02.2012';
    		yesterday='30.01.2012';
    		for(var i=0; i<data.results.length; i++){
    			var deliveryDate=data.results[i].delivery_date;
    			if(deliveryDate==currentDate || deliveryDate == tomorrow || deliveryDate == dayAfterTomorrow){
					var orderNo=data.results[i].order_no;
    				var status=data.results[i].order_status;
					var tempItem=displayOrderHistory(itemNo, orderNo, deliveryDate, status);
    				futureDeliveries=futureDeliveries+tempItem;
    				futureCounter++;
    				itemFoundFlag=true;
    				console.log('Counter : ', futureCounter, 'futureDeliveries : ', futureDeliveries);
    			}
    			if(futureCounter==2){
					//return false;
    				break;
				}
    		}
    		for(var i=0; i<data.results.length; i++){
    			var deliveryDate=data.results[i].delivery_date;
    			if(deliveryDate == yesterday || deliveryDate == dayBeforeYesterday){
    				var orderNo=data.results[i].order_no;
    				var status=data.results[i].order_status;
					var tempItem=displayOrderHistory(itemNo, orderNo, deliveryDate, status);
					pastDeliveries=pastDeliveries+tempItem;
    				pastCounter++;
    				itemFoundFlag=true;
    				console.log('Counter : ', pastCounter, 'pastDeliveries : ', pastDeliveries);
    			}
    			if(pastCounter==2){
					//return false;
    				break;
				}
    		}
    		if(itemFoundFlag==false){
				noItemFound='<tr class="fontG bold"><td colspan="3">No Orders Found</td></tr>';
				$('.order-history-container').append(noItemFound);
				console.log('No Item Found');
			}else{
				$('.order-history-container').append(futureDeliveries);
				$('.order-history-container').append(pastDeliveries);
			}
    		refreshScroll();
    		$('.overlay, .loader').fadeOut();
	    },function(err){
	    	console.log(err);
	    	var errorMsg='<tr class="fontG bold"><td colspan="3">Server not responding</td></tr>';
			$('.order-history-container').append(errorMsg);
			console.log('Server not responding');
			refreshScroll();
			$('.overlay, .loader').fadeOut();
	    }
    );
}

function displayOrderHistory(articleNumber, orderNo, deliveryDate, status){
	console.log('In displayOrderHistorys');
	var getItemDetailsUri=uriPrefix+"ZSP_ORDER_ENQ_ITM/zsp_order_enq_itmCollection?$filter=iv_site eq '"+site+"' and iv_article eq '"+articleNumber+"' and iv_order_no eq '"+orderNo+"'";
	var getItemDetailsHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: getItemDetailsUri, // OData endpoint URI
        method: "GET",
        timeoutMS: 20000
    };
    OData.request(getItemDetailsHeader, 
    	function(data,response){
			var quantity=data.results[0].order_qty;
			console.log(orderNo, quantity);
			var returnValue="<table cellspacing='0' class='order-history-item'>"
							+"<tr>"
							+"<th class='deliveryDate pad2 borderB width50 txtLft'> Order #<span class='orderNo padL5'>"+orderNo+"</span></th>"
							+"<th class='pad2 borderB width48 txtRight'><span class='status padL5'>"+status+"</span></th>"
							+"</tr>"
							+"<tr>"
							+"<td colspan='2' class='pad2'>Quantity :  <span class='quantity'>"+quantity+"</span></td>"
							+"</tr>"
							+"<tr>"
							+"<td colspan='2' class='pad2'>Delivery Date :  <span class='deliveryDate'>"+deliveryDate+"</span></td>"
							+"</tr>"
							+"</table>";
			return returnValue;
		}, function(err){
			var returnValue='';
			return returnValue;
		}
	);	
}*/
/* ---------------------------------- Order Quantity -Order and IBT History service starts ends ---------------------------------- */

/*-------------------------- Stock Adjust On Load service starts --------------------------*/
function loadReasonCodes(){
	$('.overlay, .loader').fadeIn();
	console.log('Loading reason codes.');
	var loadReasonCodesUri = uriPrefix+"ZSP_MVMT_TYPE/zsp_mvmt_typeCollection?$filter=iv_source eq 'A'";
	var loadReasonCodesHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : loadReasonCodesUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(loadReasonCodesHeader,
		function (data, response){
		var responseLength=data.results.length;
		console.log(responseLength);
			if(responseLength>1){
				for(var i=0; i<=responseLength-1; i++){
					var indicatorValue=data.results[i].indicator;
					var reasonCode=data.results[i].mvmt_type;
					var value=toProperCase(data.results[i].mvmt_type_desc);
					//console.log('I : ', indicatorValue, ' C : ', reasonCode, ' V : ', value);
					var selectField='<option value="'+reasonCode+'" indicator="'+indicatorValue+'" reason-code="'+reasonCode+'">'+value+'</option>';
					$('.reason-code').append(selectField);
				}
				if(parseInt(localStorage['SA_counter'])>0){
					$('.reason-code').val(localStorage['SA_reason']);
					displayPlusOrMinus();
				}else{
					if(Number(localStorage['SE_soh'])<=0){
						$('.reason-code').val('Z77');
						displayPlusOrMinus();
					}else {
						$('.reason-code').val('Z78');
						displayPlusOrMinus();
					}
				}
				calculateNewSoh();
			}
			$('.overlay, .loader').fadeOut();
		},function(err) {
			console.log("Error! No response received.");
		}
	);
}
/*-------------------------- Stock Adjust On Load service ends --------------------------*/


/*-------------------------- Check if article or  plu or both --------------------------*/

function checkArticleAndPlu(plu, i){
	var field;
	if(i==1){
		field='gtin';
		rangedDOM='';
		nonRangedDOM='';
	}else{
		field='article';
	}
	var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_"+field+"  eq '"+plu+"' and iv_site eq '"+site+"'";
	console.log('checkArticleAndPlu', productLookupUri);
	var productLookupHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : productLookupUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(productLookupHeader,
		function (data, response){
			if(data.results[0].msg!="No Data Found"){
				localStorage['SE_articleNumber']=data.results[0].article.replace(/^0+/, '');
				console.log('In not no data found', localStorage['SE_articleNumber']);
				localStorage['SE_description']=data.results[0].description;
				localStorage['SE_soh']=data.results[0].stock_on_hand;
				localStorage['SE_om']=data.results[0].ord_mul;
				localStorage['SE_uom']=data.results[0].base_uom;
				var ranged = data.results[0].ranged_flag;
			    var articleNo = data.results[0].article.replace(/^0+/, '');
			    var description = data.results[0].description;
			    var soh=data.results[0].stock_on_hand;
			     var tab='';
			     var box='';
			     var stockText='';
			     if(soh>0){
			    	 tab='ranged-tab';
			    	 box='ranged-box';
			    	 stockText='In Stock';
			     }else{
			    	 tab='non-ranged-tab';
			    	 box='non-ranged-box';
			    	 stockText='Not in Stock';
			     }
			    if(ranged=='Y'){
			    	console.log('ranged');
			    	rangedDOM= rangedDOM+'<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
				     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
				     +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class="item-desc-val grey articleNo">'
				     +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
				     +description+'</div><input type="hidden" id="rangedFlag" value="true">'
				     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
				     +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
				     +'</tbody></table></div></div>';
			    	console.log(rangedDOM);
			    }else{
			    	console.log('nonranged');
			    	nonRangedDOM = nonRangedDOM+'<div class="levelThree"><div class="levelTwo '+tab+'"></div>'
					 +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14">'
					 +'<tbody><tr><td class="item-desc-txt grey">Article #</td><td class="item-desc-val grey articleNo">'
					 +articleNo+'</td></tr><tr><td colspan="2" class="item-desc-val grey description"><div class="to-lookup-Div">'
					 +description+'</div><input type="hidden" id="rangedFlag" value="true">'
					 +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
					 +'<tr><td colspan="2"><span class="'+box+'">'+stockText+'</span></td></tr>'
					 +'</tbody></table></div></div>';
			    	console.log(nonRangedDOM);
			    }
				if(i==1){
					localStorage['pluFlag']=true;
					console.log(data.results[0]);
					console.log('i==1');
					checkArticleAndPlu(plu, 2);
				}else{
					localStorage['articleFlag']=true;
					console.log(data.results[0]);
					/*console.log('i==2');
					displayArticlePluResults(rangedDOM, nonRangedDOM);*/
				}
			}else{
				console.log(i, 'Not found');
				if(i==1){
					localStorage['pluFlag']=false;
					console.log('i==1 false');
					//displayArticlePluResults(rangedDOM, nonRangedDOM, plu);
					checkArticleAndPlu(plu, 2);
				}
			}
			if(i==2){
				console.log('i==2');
				displayArticlePluResults(rangedDOM, nonRangedDOM, plu);
			}
		},function(err) {
			console.log("Error! No response received.", i, plu);
		}
	);
	
}

function displayArticlePluResults(rangedDOM, nonRangedDOM, plu){
	console.log('displayArticlePluResults', rangedDOM.length, nonRangedDOM.length);
	if(localStorage['pluFlag']=='true' && localStorage['articleFlag']=='true'){
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
		localStorage['bothFlag']=true;
		if(localStorage['tabClicked']=='OtherStores'){
			console.log('OTHERSTORES');
			$('#content #itemList .other-stores-list').html('');
			if(nonRangedDOM.length>0){
				$('#content #itemList .other-stores-list').append(nonRangedDOM);
			}else{
				$('#content #itemList .other-stores-list').html(errMsg);
			}
		}else{
			console.log('NOT OTHERSTORES');
			$('#content #itemList .srch-rslt-list').html('');
			if(rangedDOM.length>0){
				 $('#content #itemList .srch-rslt-list').append(rangedDOM);
			}else{
				$('#content #itemList .srch-rslt-list').html(errMsg);
			}
		}
		if(typeof prevPage!='undefined'){
	    	 if(prevPage=='stockAdjust'){
	    		 clickStockAdjust();
	    	 }
	     }else{ 
	    	 bindCLickEvent();
	     }
	}else if(localStorage['pluFlag']=='true'){
		if(typeof prevPage!='undefined'){
	    	 if(prevPage=='stockAdjust'){
				localStorage["pageId"] = 'stockAdjust';
				window.location = 'stockAdjust.html';
	    	 }
	     }else{ 
			localStorage['typeOfInput']='plu';
			localStorage['fromXtoDetails']='Lookup';
			window.location = 'LookupDetails.html?'+ 'articleNumber='+ plu;
	     }
	}else{
		if(typeof prevPage!='undefined'){
	    	 if(prevPage=='stockAdjust'){
				localStorage["pageId"] = 'stockAdjust';
				window.location = 'stockAdjust.html';
	    	 }
	     }else{ 
			localStorage['fromXtoDetails']='Lookup';
			localStorage['typeOfInput']='article';
			window.location = 'LookupDetails.html?'+ 'articleNumber='+ plu;
	     }
	}
	console.log('pluFlag : ', localStorage['pluFlag'], ' articleFlag : ', localStorage['articleFlag'], ' bothFlag : ', localStorage['bothFlag']);
	$('.overlay, .loader').fadeOut();
}

function showNonRangedItems(){
	localStorage['checkArticleAndPlu']='false';
	console.log('In showNonRangedItems');
	 console.log(localStorage['typeOfInput']);
	 var typeOfInput=localStorage['typeOfInput'];
	 if(typeOfInput=='advanced'){
		 localStorage['tabClicked'] = 'AdvancedOtherStores';
	 }else{
		 localStorage['tabClicked'] = 'OtherStores';
	 }
	 console.log("localStorage['tabClicked'] : ", localStorage['tabClicked']);
	 $('.overlay, .loader').fadeIn(300);
	 centerAlign('.loader');
	 var productSearchInput=localStorage['searchTerm'];
	 console.log('productSearchInput : ', productSearchInput);
	 $('.greenSep-left').css('visibility', 'hidden');
	 $('.greenSep-right').css('visibility', 'visible');
	 if ($.isNumeric(productSearchInput) && typeOfInput!='advanced'){
		 
		/* $('.srch-rslt-txt').removeClass('greenTab fontWhite');
		 $('.srch-rslt-txt').addClass('fontGreen');
		 $('.other-stores-txt').removeClass('fontGreen');
		 $('.other-stores-txt').addClass('greenTab fontWhite');*/
		 $('.srch-rslt-list').hide();
		 $('.other-stores-list').show();
		 if(productSearchInput.length==4){
			console.log('==4');
			localStorage['typeOfInput']='plu';
			localStorage['checkArticleAndPlu']='true';
			localStorage['pluFlag']=false;
			localStorage['articleFlag']=false;
			localStorage['bothFlag']=false;
			checkArticleAndPlu(productSearchInput, '1');
		 }
	 }
	 else{
		 /*$('.srch-rslt-txt').removeClass('greenTab fontWhite');
		 $('.srch-rslt-txt').addClass('fontGreen');
		 $('.other-stores-txt').removeClass('fontGreen');
		 $('.other-stores-txt').addClass('greenTab fontWhite');*/
		 $('.srch-rslt-list').hide();
		 $('#content #itemList .other-stores-list').html('');
		 $('.other-stores-list').show();
		 localStorage['searchTerm']=productSearchInput;
		 if(typeOfInput!='advanced'){
			 localStorage['typeOfInput']='description';
		 }
		 productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_desc  eq '*"+encodeURIComponent(productSearchInput)+"*' and iv_site eq '"+site+"'";
 		 productLookup(productLookupUri);
	 }
}

function toogleButtons(){
	setTimeout(function() {
		$('.container').slideToggle("200");
	}, 500);
};

function showNearbyStores(){
	console.log('In showNearbyStores');
	localStorage['NS_articleNumber']=$('#articleNumber').text();
	localStorage['NS_description']=$('#description').text();
	console.log('A : ', localStorage['NS_articleNumber'] ,' D : ', localStorage['NS_description']);
	window.location='nearbyStores.html';
}

function loadFullDetails(){
	console.log('In loadFullDetails');
	$('.load-additional').fadeOut(500);
	$('.additional-container').fadeIn(300);
	refreshScroll();
}

function refineSearch(){
	console.log('In refineSearch');
	var storeNumber=$('#search-input').val();
	var salesOrg=$('#salesSelect').val();
	var distance=$('#kmSelect').val();
	var maxNoOfStores=$('#maxnoSelect').val();
	if(storeNumber=='') {
		storeNumber=localStorage['site'];
	}
	if(salesOrg=='default'){
		salesOrg=localStorage['salesOrg'];
	}
	if(distance=='default'){
		distance='20';
	}
	if(maxNoOfStores=='default'){
		maxNoOfStores='20';
	}
	localStorage['NS_storeNumber']=storeNumber;
	localStorage['NS_salesOrg']=salesOrg;
	localStorage['NS_distance']=distance;
	localStorage['NS_maxNoOfStores']=maxNoOfStores;
	localStorage['fromRefineSearch']='true';
	localStorage['pageId']='nearbyStores';
	window.location='nearbyStores.html';
}

function showStockAdjust(){
	console.log('In showStockAdjust');
	localStorage['SE_articleNumber']=$('#articleNumber').text();
	localStorage['SE_description']=$('#description').text();
	var soh=$('#stockOnHand').text().split(' ')[0];
	var uom=$('#stockOnHand').text().split(' ')[1];
	var om=$('#orderMultiple').text();
	var deptId=$('#trading-dept').text().split(" | ")[0];
	var rangedFlag = localStorage['rangedFlag'];
	localStorage['SE_soh']=soh;
	localStorage['SE_om']=om;
	localStorage['SE_uom']=uom;
	localStorage['SE_dept']=deptId;
	console.log('A : ', localStorage['SE_articleNumber'] ,' D : ', localStorage['SE_description'], soh, om, uom );
	localStorage["pageId"]="stockAdjust";
	if ( rangedFlag == "N" && soh <= 0) {
		$('#error-popup .popup-msg').text('Please select a ranged stock');
		$('#error-popup, .overlay').fadeIn(300);
		centerAlign('#error-popup');
	}
	else {
		window.location="stockAdjust.html";
	}
}


function removeSelectedBarcode(){
	console.log('In removeSelectedBarcode()');
	localStorage['displaySaved']='false';
	$('#articleNumber').val('');
	$('#description').text('');
	$('.quantityOM').text('');
	$('.OMContainer').fadeOut();
	$('.stockOnHand').text('');
	$('.barcode-details').fadeOut(300);
	$('.quantityBlk').addClass('hide');
	$('#footer').hide();
	$('.barcode-deleted').fadeIn(300);
	setTimeout(function () {
		$('.barcode-deleted').fadeOut(300);
	}, 1000);
	setHeight();
	refreshScroll();
}

function getAllWarehouse(){
	console.log('In getAllWarehouse');
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	var getWarehouseUri=uriPrefix+"ZSP_IBT_SUPP_SITE/zsp_ibt_supp_siteCollection?$filter=iv_site eq '"+site+"'";
	var getWarehouseHeader = {
			headers : oHeaders, 
			requestUri : getWarehouseUri, 
			method : "GET",
			timeoutMS : 200000
		};
		OData.read(getWarehouseHeader, 
			function(data, response) {
				var numberOfSuppliers=data.results.length;
				console.log('URI : ',getWarehouseUri, ' Response Length : ', data.results.length);
				if(numberOfSuppliers>=1){
					for (var i = 0; i < data.results.length; i++) {
						var supplierNumber=data.results[i].site_no;
						var supplierName=toProperCase(data.results[i].site_name);
						console.log('Number : ', supplierNumber, ' Name : ', supplierName);
						$('#warehouse-list').append($('<option>', { 
					        value: supplierNumber,
					        text : supplierNumber+" | "+supplierName
					    }));
						$('.overlay, .loader').fadeOut(300);
				     }
					var selectedWarehouse=localStorage['searchSupplier_'+localStorage['previousPage']];
					if(selectedWarehouse!='undefined')
						$('#warehouse-list').val(selectedWarehouse);
					if(wool.tableExists("OrderListTable")){
						var numberOfItemsOrdered = wool.query('OrderListTable').length;
						if(numberOfItemsOrdered>0){
							var suppliertype = localStorage['supplierType_createOrder'];
							var radioId="#"+suppliertype;
							$(radioId).attr('checked', 'checked');
							$('input:radio[name=supplierType]').attr('disabled', 'disabled');
							if(suppliertype=='warehouse'){
								$('#warehouse-list').removeAttr('checked', 'checked');
								var selectedWarehouse=localStorage['searchSupplier_createOrder'];
								$('#warehouse-list').val(selectedWarehouse);
								$('#warehouse-list').attr('disabled', 'disabled');
								$('.warehouse-container').show();
							}
						}
					}
				}
		}, function(err) {
			$('#warehouse-list').append($('<option>', { 
		        value: 'default',
		        text : 'Server not responding'
		    }));
			$('.overlay, .loader').fadeOut(300);
		}
	);
}



function gotoOrderList(){
	var noOfItems=$('.no-of-items').text();
	localStorage['noOfitems']=noOfItems;
	localStorage["pageId"]="orderList"; 
	window.location="orderList.html";
}

function populateOrderList(){
	console.log("inside populate order list");
	var previousPage=localStorage['previousPage'];
	var tableName='';
	var rosterDateDisabled='';
	if(previousPage=='createOrder'){
		tableName='OrderListTable';
	}else if(previousPage=='ibt'){
		tableName='IBTListTable';
		rosterDateDisabled='disabled';
	}else if(previousPage=='createPreq'){
		tableName='PreqListTable';
	}else if(previousPage=='createOrderOnReceipt'){
		tableName='CORListTable';
	}	
	if(!wool.tableExists(tableName)){
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders to Display</div>';
		$('#content #itemList .srch-rslt-list').html(errMsg);
	}else{
		var searchResults = wool.query(tableName);
		localStorage['fromOrderlist']="true";
		
		console.log('search : ', searchResults, tableName, searchResults.length);
		for ( var i = searchResults.length-1; i >= 0; i--) {
			var articleNo = searchResults[i].ItemNo; 
			var description = searchResults[i].Description.replace(/\s{2,}/g, ' ');; 
			var soh = searchResults[i].SOH; 
			var om = searchResults[i].OM; 
			var uom = searchResults[i].UOM;
			var cartonSelected='selected';
			var eachSelected='';
			var selectedUom='';
			if(previousPage=='ibt'){
				var isChanged=false;
				selectedUom=searchResults[i].SelectedUom;
				console.log('selected UOm : ', selectedUom);
				if(localStorage['uomChangedList'].length>0){
					for(var n=0; n<localStorage['uomChangedList'].split(" | ").length; n++){
						if(localStorage['uomChangedList'].split(" | ")[n].indexOf(articleNo)!=-1){
							isChanged=true;
						}
					}
					console.log('isChanged : ', isChanged);
					if(isChanged){
						if(selectedUom=='EA'){
							eachSelected='selected';
							cartonSelected='';
						}else{
							cartonSelected='selected';
							eachSelected='';
						}
					}
					console.log(eachSelected, cartonSelected);
				}
			}
			localStorage['uomOnRecQty']=om;
			localStorage['uomPop']=uom;
			console.log('uomlocal: ',localStorage['uomPop']);
			console.log('results: ', searchResults[i]);
			var unitPrice = searchResults[i].UnitPrice; 
			var quantity = searchResults[i].Quantity;
			localStorage['ordOnRecQty']=quantity;
			var deliveryDate = searchResults[i].DeliveryDate;
			var vendorNo = searchResults[i].VendorNo;
			var newFlag = searchResults[i].NewFlag;
			localStorage['venNo'] = vendorNo;
			var vendorName = searchResults[i].VendorName;
			var department = searchResults[i].Department;
			var rosterDate = searchResults[i].RosterDate;
			var emergencyFlag = searchResults[i].EmergencyFlag;
			var supplierType = searchResults[i].SupplierType;
			var deliveryDateFormat=deliveryDate.replace(/\-/g, '/');
			var dateFormat=new Date(deliveryDateFormat);
			var date=dateFormat.getDate();
			if (date >= 11 && date <= 13) {
		        date=date+"th";
		    }else{
		    	switch (date % 10) {
			        case 1:   date=date+"st"; break;
			        case 2:   date=date+"nd"; break;
			        case 3:   date=date+"rd"; break;
			        default:  date=date+"th"; break;
			    }
		    }
		    
			var day = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ][dateFormat.getDay()];
			var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
			var month=monthNames[dateFormat.getMonth()];
			var formattedDeliveryDate=day+", "+date+" "+month;
			var calculatedQuantity = Number((quantity*om).toFixed(3));
			if(previousPage=='ibt' && selectedUom=='EA'){
				calculatedQuantity=Number(quantity);
			}
			console.log(formattedDeliveryDate);
			console.log('calculatedQuantity',calculatedQuantity,'vendorNo',vendorNo,'quantity',quantity);
			//var optionalField='';
			//if(previousPage=='ibt'){
				var purchasePrice=searchResults[i].PurchasePrice;
				//optionalField='<input type="hidden" class="purchasePrice" value="'+purchasePrice+'">';
			//}
		/*	var orderItem='<div class="levelThree order-list-item new-item"><div class="levelOne">'
			+'<table class="order-lst-itm fontHel font14 ranged">'
			+'<tbody><tr><td>'
			+'<span class="item-desc-txt dark-green">Article &nbsp; #</span>'
			+'<span class="item-desc-val articleNo dark-green">'+articleNo+'</span>'
			+'</td></tr><tr>'
			+'<td colspan="2" class="item-desc-val description">'
			+'<div class="to-lookup-Div dark-green">'+description+'</div>'
			+'<input type="hidden" class="supplierType" value="'+supplierType+'">'
			+'<input type="hidden" class="vendorNo" value="'+vendorNo+'">'
			+'<input type="hidden" class="vendorName" value="'+vendorName+'">'
			+'<input type="hidden" class="om" value="'+om+'">'
			+'<input type="hidden" class="unitPrice" value="'+unitPrice+'">'
			+'<input type="hidden" class="deliveryDate" value="'+deliveryDate+'">'
			+'<input type="hidden" class="rosterDate" value="'+rosterDate+'">'
			+'<input type="hidden" class="emergencyFlag" value="'+emergencyFlag+'">'
			+optionalField
			+'</td></tr><tr>'
			+'<td colspan="2" class="bold">'
			+'<span class="" >SOH : </span><span class="soh" >'+soh+'</span>'
			+'<span>,</span> &nbsp;<span class="" >Ordered : </span><span class="quantity" >'+quantity+'</span> CAR'
			+' ( <span class="calculatedQuantity">'+calculatedQuantity+'</span> <span class="uom">'+uom+'</span> )'
			+'</td></tr><tr><td colspan="2">'
			+'<span class="deliverDateTxt" >Will be delivered on </span>' 
			+'<span class="deliverDateFormatted" >'+formattedDeliveryDate+'</span>'
			+'<div class="editListItems boxDisp boxEndPack hide">'
			+'<img src = "../images/editButton.png" alt = "editList" class = "listEditImg" />'
			+'<img src = "../images/deleteButton.png" alt = "editList" class = "listDelImg" />'
			+'</div></td></tr></tbody></table></div></div>';
			$('#content #itemList .srch-rslt-list').append(orderItem);
		*/
			var detailsSectionHide='';
			var editSectionHide='';
			if(newFlag==true){
				detailsSectionHide=' hide ';
			}else{
				editSectionHide=' hide ';
			}
			console.log(newFlag, detailsSectionHide, editSectionHide);
			var orderItem='<div class = "order-list-item new-article new-items">'
				
				+'<input type="hidden" class="supplierType" value="'+supplierType+'">'
				+'<input type="hidden" class="vendorNo" value="'+vendorNo+'">'
				+'<input type="hidden" class="vendorName" value="'+vendorName+'">'
				+'<input type="hidden" class="om om-value" value="'+om+'">'
				+'<input type="hidden" class="uom uom-value" value="'+uom+'">'
				+'<input type="hidden" class="unitPrice" value="'+unitPrice+'">'
				+'<input type="hidden" class="emergencyFlag" value="'+emergencyFlag+'">'
				+'<input type="hidden" class="purchasePrice" value="'+purchasePrice+'">'
				+'<input type="hidden" class="soh" value="'+soh+'">'
				
				+'<div id="invent-details-section" class="details-section '+detailsSectionHide+' invent-save-section orderRad4">'
				+'<div class="width100 art-section">'
				+'<div class="width48 inlineBlock margin-left15 dark-green normal"><label>Article #</label><label class="articleNo" >'+articleNo+'</label></div>'
				+'<div class="width48 inlineBlock gray-text float-right"><label>SOH :&nbsp</label><label class="soh" >'+soh+'</label></div>'
				+'<div class="text-left margin-left15 margin-top5 dark-green bold"><label class="description" >'+description+'</label></div>'
				+'</div>'
				+'<div class="qty-section width100">'
				+'<div class="width30 inlineBlock margin-left15"><div class="orderQtyTxt margin-top10 gray-text">Qty. (CAR)</div><div class="margin-top5 qtyDisp dispInline margin-bottom10"><span class="quantity">'+quantity+'</span></div> <label class="normal">(<span class="calculatedQuantity editCalculatedQuantity">'+calculatedQuantity+'</span> <span class="uom edituom">'+uom+'</span>)</label></div>'
				+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Roster Date</div><div class="margin-top5 rosDate margin-bottom10 margin-left15">'+rosterDate+'</div></div>'
				+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Delivery Date</div><div class="margin-top5 delviDate margin-bottom10 margin-left15">'+deliveryDate+'</div></div>'
				+'</div>'
				+'<div class="width100 more-section page-bg">'
				+'<div class="save-moreToggle margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/LookUp_DownArrow.png" id="more-img-1" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">more details</div></div>'
				+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delBtn" ></div>'
				+'<div class="inlineBlock float-right"><img src="../images/editButton.png"  alt="div-bar" class="action-btn editBtn" ></div>'
				+'<div id="more-details-1" class="details-section borderRad4 hide">'
				+'<div class="height30 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Department :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="department">'+department+'</div></div>'
				+'<div class="divider-img"><img class="list-div" alt="div" src="../images/LookUpDottedLineDivider.png"></div>'
				+'<div class="salesHistory margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/iconSalesHistory.png" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">Sales History</div></div>'
				+'<div class="openOrders margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/iconOpenOrdders.png" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">Open Orders</div></div>'
				+'</div>'
				+'</div>'				
				+'</div>'
				
				+'<div id="invent-edit-section" class="margin-top10 details-section invent-edit-section '+editSectionHide+'new-item ">'
				+'<div class="width100 art-section">'
				+'<div class="width48 inlineBlock margin-left15 dark-green normal"><label>Article #</label><label>'+articleNo+'</label></div>'
				+'<div class="width48 inlineBlock gray-text float-right"><label>SOH :&nbsp</label><label>'+soh+'</label></div>'
				+'<div class="text-left margin-left15 margin-top5 dark-green bold"><label>'+description+'</label></div>'
				+'</div>'
				+'<div class="qty-section width100">'
				+'<div id="more-details-1" class="">'
				+'<div class="height30 boxDisp border-bottom-gray"><div class="boxDisp boxAlign width50 text-align-left">Roster Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockOnHand"><input id="datepicker-roster" class="datepicker-roaster roster-date search-field orderListTxt date-field" type="date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value = '+rosterDate+' '+rosterDateDisabled+'></div></div>'
				+'<div class="height30 boxDisp border-bottom-gray"><div class="boxDisp boxAlign text-align-left width50">Delivery Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockInTransit"><input id="datepicker-delivery"  class="search-field datepicker-delivery delivery-date orderListTxt date-field" type="date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value = '+deliveryDate+' ></div></div>'
				+'<div class="height30 boxDisp "><div class="orderQtyTxt boxDisp boxAlign text-align-left width50">Order Qty. (CAR) :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockOnOrder"><input id="search-input" class="width40 orderQty width35 search-field orderListTxt" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" value = '+quantity+' ><label class="normal">(<span class="calculatedQuantity tosaveCalcQty">'+calculatedQuantity+'</span> <span class="uom toSaveuom">'+uom+'</span>)</label></div></div>'
				+'<div class="height30 boxDisp ibtDropdown hide"><div class="boxDisp boxAlign text-align-left width50"></div><div class="boxDisp boxAlign width48 item-val looupFont normalN" >'
				+'<select class = "ibtDrop width100 search-field orderListTxt" >'
				+'<option value = "stdCarton" '+cartonSelected+' >Standard Carton</option><option value = "each"  '+eachSelected+' >EA</option></select></div></div>'
				+'</div>'
				+'</div>'
				+'<div class="width100 more-section page-bg">'
				+'<div class="edit-moreToggle margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/LookUp_DownArrow.png" id="more-img-2" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">more details</div></div>'
				+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delBtn" onclick = "deleteOrderList();" ></div>'
				+'<div class="inlineBlock float-right"><img src="../images/saveButton.png" alt="div-bar" class="action-btn saveBtn" ></div>'
				+'<div id="more-details-2" class="details-section borderRad4 hide">'
				+'<div class="height30 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Department :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="department">'+department+'</div></div>'
				+'<div class="divider-img"><img class="list-div" alt="div" src="../images/LookUpDottedLineDivider.png"></div>'
				+'<div class="salesHistory margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/iconSalesHistory.png" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">Sales History</div></div>'
				+'<div class="openOrders margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"><div class="inlineBlock"><img src="../images/iconOpenOrdders.png" alt="div-bar" class="more-img" ></div><div class="inlineBlock openOrders absolute">Open Orders</div></div>'
				+'</div>'
				+'</div>'				
				+'</div>'
				+'</div>';
			$('#content #itemList').append(orderItem);
		}
		
		if($('.orderListDone').is(":visible")){
			editList();
		}
	}
}

function populateVendorSearchResults(searchVendor){
	//SearchVendor, VendorName, VendorNo
	if(!wool.tableExists("vendorSrchRslt")){
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Vendors to Display</div>';
		$('#content').html(errMsg);
	}else{
		var searchResults = wool.query("vendorSrchRslt", {
			SearchVendor : searchVendor
		});
		for ( var i = 0; i < (searchResults.length); i++) {
			var vendorNo = searchResults[i].VendorNo;
			var vendorName = toProperCase(searchResults[i].VendorName);
			var vendor=vendorNo+" | "+vendorName;
			var vendorItem='<div class="levelThree vendorItem"><div class="levelOne">'
				+'<table class="order-lst-itm fontHel font14">'
				+'<tbody><tr><td colspan="2"><input type="radio" name="vendor" value="'+vendor+'"/></td><td>'
				+'<span class="item-desc-val bold">Vendor #</span>'
				+'<span class="item-desc-val vendorNo bold">'+vendorNo+'</span></td>'
				+'</tr><tr><td colspan="2" class="item-desc-val"></td>'
				+'<td><span class="description vendorName">'+vendorName+'</span></td>'
				+'</tr></tbody></table></div></div>';
			$('#content').append(vendorItem);
		}
		/*$('.vendorItem').bind('click', function() {
			var vendorNo = $(this).find('.vendorNo').text();
			var vendorName = $(this).find('.vendorName').text();
			localStorage['searchSupplier_createOrder'] = vendorNo;
			localStorage['searchSupplierName_createOrder'] =  vendorName;
			console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
			productSearch();
		});*/
	}
	$('.overlay, .loader').fadeOut(300);
	refreshScroll();
}
function selectSupplier(){
	var previousPage=localStorage['previousPage'];
	if(previousPage=='ibt'){
		selectStore();
	}else{
		selectVendor();
	}
}
function selectStore(){
	var selectedStore=$("input:radio[name=store]:checked").val();
	var storeNo = selectedStore.split(' | ')[0];
	var storeName = selectedStore.split(' | ')[1];
	/*var storeSalesOrg = selectedStore.split(' | ')[2];
	var currentSalesOrg=localStorage['salesOrg'];
	//if((currentSalesOrg=='1020' && storeSalesOrg!='1020') || (currentSalesOrg!='1020' && storeSalesOrg=='1020')){
	if(currentSalesOrg!=storeSalesOrg){
		console.log('Petrol Store validation ');
		errorOkPopup("Order cannot be created across Sales Orgs","");
	}else{*/
		localStorage['searchSupplier_ibt'] = storeNo;
		localStorage['searchSupplierName_ibt'] =  storeName;
		console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
		productSearch();
	//}
}

function selectVendor(){
	var previousPage=localStorage['previousPage'];
	var selectedVendor=$("input:radio[name=vendor]:checked").val();
	var vendorNo = selectedVendor.split(' | ')[0];
	var vendorName = selectedVendor.split(' | ')[1];
	localStorage['searchSupplier_'+previousPage] = vendorNo;
	localStorage['searchSupplierName_'+previousPage] =  vendorName;
	console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
	productSearch();
}

function populateArticleSearchResults(searchKey){
	console.log(searchKey);
	var previousPage=localStorage['previousPage'];
	console.log(previousPage);
	var tableName='ArticleSearchResults';
	console.log(tableName);
	if(!wool.tableExists(tableName)){
		console.log('table does not exist');
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Articles to Display</div>';
		$('#content').html(errMsg);
	}else{
		var searchResults = wool.query(tableName, {
			SearchKey : searchKey
		});
		console.log('tableexists : ', searchResults.length);
		if(searchResults.length==0){
			console.log('0 items');
			var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Articles to Display</div>';
			$('#content').html(errMsg);
		}else{
			for ( var i = 0; i < (searchResults.length); i++) {
				var articleNo = searchResults[i].ItemNo;
				var articleName = toProperCase(searchResults[i].Description);
				var soh=searchResults[i].Soh;
				var om=searchResults[i].Om;
				var uom=searchResults[i].BaseQty;
				var unitPrice=searchResults[i].UnitPrice;
				var purchasePrice=searchResults[i].PurchasePrice;
				var sos=searchResults[i].Sos;
				var vendorName=searchResults[i].VendorName;
				var vendorNo=searchResults[i].VendorNo;
				var department=searchResults[i].Department;
				var article=articleNo+" | "+articleName+" | "+soh+" | "+om+" | "+uom+" | "+unitPrice+" | "+sos+" | "+vendorNo+" | "+vendorName+" | "+department+" | "+purchasePrice;
				
				var articleItem='<div class="levelThree articleItem"><div class="levelOne">'
					+'<table class="order-lst-itm fontHel font14">'
					+'<tbody><tr><td colspan="2"><input type="radio" name="article" value="'+article+'"/></td><td>'
					+'<span class="item-desc-val bold">Article #</span>'
					+'<span class="item-desc-val articleNo bold">'+articleNo+'</span></td>'
					+'</tr><tr><td colspan="2" class="item-desc-val"></td>'
					+'<td><span class="description ">'+articleName+'</span></td>'
					+'</tr></tbody></table></div></div>';
				$('#content').append(articleItem);
			}
		}
	}
	$('.overlay, .loader').fadeOut(300);
	refreshScroll();
}

function deleteArticleFromOrder(){
	var articleNumber=localStorage['DA_articleNo'];
	var previousPage=localStorage['previousPage'];
	var tableName='';
	if(previousPage=='createOrder'){
		tableName='OrderListTable';
	}else if(previousPage=='ibt'){
		tableName='IBTListTable';
	}else if(previousPage=='createPreq'){
		tableName='PreqListTable';
	}else if(previousPage=='createOrderOnReceipt'){
		tableName='CORListTable';
	}
	wool.deleteRows(tableName, {ItemNo: articleNumber});
	wool.commit();
	var numberOfItemsOrdered = wool.query(tableName).length;
	console.log('numberOfItemsOrdered : ', numberOfItemsOrdered);
	if(numberOfItemsOrdered==0){
		localStorage['uomChangedList']='';
		localStorage['displaySaved']='false';
		localStorage['pageId']=previousPage;
		window.location=previousPage+'.html';
	}else{
		if(localStorage['pageId']=='orderListEdit'){
			localStorage['pageId']=='orderList';
			window.location='orderList.html';
		}else{
			$('#itemList').html('');
			$('#no-of-items').text(numberOfItemsOrdered);
			$('#confirm-popup, .overlay').fadeOut();
			//populateOrderList();
			localStorage['pageId']='orderList';
			window.location='orderList.html';
		}
	}
	
}

/*Adding ToggleAttr function*/

(function($) {
    $.fn.toggleDisabled = function(){
        return this.each(function(){
            this.disabled = !this.disabled;
         });
    };
})(jQuery);


function getArticleNumberFromGTIN(gtin, pageId){
	var articleNumber='';
	console.log('GTIN : ', gtin);
	var	getArticleNumberFromGTINUri=uriPrefix+"ZSP_ARTICLE_FROM_BARCODE/zsp_article_from_barcodeCollection?$filter=iv_barcode eq '"+gtin+"'";
	console.log('URI : ', getArticleNumberFromGTINUri);
	var getArticleNumberFromGTINHeader = {
		headers : oHeaders, 
		requestUri : getArticleNumberFromGTINUri, 
		method : "GET",
		timeoutMS : 200000
	};
	OData.read(getArticleNumberFromGTINHeader, 
		function(data, response) {
			console.log('URI : ', getArticleNumberFromGTINUri);
			console.log(data.results[0]);
			if(data.results.length>=1){
				articleNumber =  data.results[0].matnr;
				if(pageId=='lookup'){
					localStorage['typeOfInput']='article';
					productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+articleNumber+"' and iv_site eq '"+site+"'";
					localStorage['fromXtoDetails']='Lookup';
					localStorage['pageId']='LookupDetails';
					window.location= 'LookupDetails.html?'+ 'articleNumber='+ articleNumber;
				}else{
					getArticleDetailsFromBarcode(articleNumber, pageId);
				}
			}else{
				$('.loader').fadeOut();
				$('#error-popup .popup-msg').text('Item not found.');
				$('#error-popup, .overlay').fadeIn();
				centerAlign('#error-popup');
			}
		}, function(err){
			$('.loader').fadeOut();
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, .overlay').fadeIn();
			centerAlign('#error-popup');
	});
}

function preqSendNow(){
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var headerPartOne="<?xml version='1.0' encoding='utf-8'?>" +
			"<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' " +
			"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' " +
			"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' " +
			"xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
			"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PREQ_CREATE/'> " +
			"<atom:content type='application/xml'>";
	var headerPartTwo="</atom:content>" +
			"<atom:link rel='http://schemas.microsoft.com/ado/2007/08/dataservices/related/PRItems' " +
			"type='application/atom xml;type=feed'  " +
			"title='ZSP_PREQ_CREATE.PRHeader_PRItems'>" +
			"<m:inline><atom:feed>";
	var footer="</atom:feed></m:inline></atom:link></atom:entry>";
	var articleDetails="";
	var vendorDetails='';
	var itemNo=10;
	$.each($('.new-items'),function(){
		console.log('ITEM NO : ', itemNo);
		var site=localStorage['site'];
		var vendor=localStorage['venNo'];
		localStorage['PO_vendor']=vendor;
		var deliveryDate=$(this).find('.delivery-date').val();
		console.log('deliveryDate: ',deliveryDate);
		deliveryDate=deliveryDate.split('-')[0]+deliveryDate.split('-')[1]+deliveryDate.split('-')[2];
		var orderDate = $(this).find('.roster-date').val();
		orderDate=orderDate.split('-')[0]+orderDate.split('-')[1]+orderDate.split('-')[2];
		var articleNo=$(this).find('.articleNo').text();
		console.log('Item No : ', itemNo, articleNo);
		var uom=$(this).find('.edituom').text();
		//var uom="CAR";
		console.log('UOM : ', uom);
		var qty=$(this).find('.editCalculatedQuantity').text();
		//var qty=$(this).find('.qtyDisp').text();
		var trackingNumber='PR0010';
		console.log('Qty : ', qty);
		vendorDetails="<m:properties>" +
					"<d:IV_PR_TYPE>ZY</d:IV_PR_TYPE>" +
					"<d:IV_SITE>"+site+"</d:IV_SITE>" +
					"<d:IV_TRAC_NO>"+trackingNumber+"</d:IV_TRAC_NO>" +
					"<d:IV_VENDOR>"+vendor+"</d:IV_VENDOR>" +
					"<d:IV_REL_DATE>"+orderDate+"</d:IV_REL_DATE>" +
					"<d:IV_DEL_DATE>"+deliveryDate+"</d:IV_DEL_DATE>" +
					"</m:properties>";
		articleDetails=articleDetails+"<atom:entry> <atom:content type='application/xml'>" +
					"<m:properties>" +
					"<d:IV_VENDOR>"+vendor+"</d:IV_VENDOR>" +
					"<d:IV_SITE>"+site+"</d:IV_SITE>" +
					"<d:IV_ITEM_NO>"+itemNo+"</d:IV_ITEM_NO>" +
					"<d:IV_ARTICLE>"+articleNo+"</d:IV_ARTICLE>" +
					"<d:IV_QTY>"+qty+"</d:IV_QTY>" +
					"<d:IV_UOM>"+uom+"</d:IV_UOM>" +
					"</m:properties> " +
					"</atom:content>" +
					"</atom:entry>";
		itemNo+=10;
	});
	var requestXML=headerPartOne+vendorDetails+headerPartTwo+articleDetails+footer;
	console.log(requestXML);
	getPreqToken(requestXML);
}

function getPreqToken(inputStr){
	console.log('Getting token -  getPreqToken');
	var getPreqTokenUri = directUriPrefix+"ZSP_PREQ_CREATE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getPreqTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getPreqTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getPreqTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			placePreqOrder(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		}
	);
}

function placePreqOrder(header_xcsrf_token, inputStr){
	console.log(inputStr);
	var placePreqOrderUri=directUriPrefix+"ZSP_PREQ_CREATE/PRHeaders";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	//oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	console.log("Header fields : ", oHeaders);
	var placePreqOrderHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : placePreqOrderUri, // OData endpoint URI
		method : "POST",
		data : inputStr
	};
	console.log(placePreqOrderHeader);
	$.ajax({
		url: placePreqOrderUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputStr,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("Success! ");
			console.log('response :', response);
			console.log('data :', data);
			console.log(data.results);
				flag=true;
				var msg=$(data).find("IV_MSG").text();
				if(msg==''){
					
					var orderNumber=$(data).find("IV_PR_NO").text();
					console.log('PR NO : ', orderNumber);
					$('.srch-rslt-list').html('');
					$('#no-of-items').text('0');
					$('.loader').fadeOut(300);
					if(localStorage['OnReceiptFlag']=='true'){
						wool.deleteRows('CORListTable');
						wool.commit();
						$('#cor-step1-popup #order-no').text(orderNumber);
						$('#cor-step1-popup, #overlay').fadeIn();
						centerAlign('#cor-step1-popup');
					}else{
						wool.deleteRows('PreqListTable');
						wool.commit();
						$('#preq-popup #order-no').text(orderNumber);
						$('#preq-popup, #overlay').fadeIn();
						centerAlign('#preq-popup');
					}
				}else{
					$('.loader').fadeOut(300); 
					$('#error-popup .head-title').text('Error');
					$('#error-popup .popup-msg').text('Order Posting failed in SAP - '+msg);
					$('#error-popup .ok').attr('onclick',"$('#error-popup,.overlay').fadeOut(500);");
					$('#error-popup, #overlay').fadeIn();
					centerAlign('#error-popup');
				}
				
				
				//validateBack();
			},
		error:  function(err) {
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
			console.log("Error! No response received.", err.message);
		}
	});
}

function convertToPOToken(){
	console.log('In convert to PO');
	$('#preq-popup').fadeOut();
	$('.overlay, .loader').fadeIn();
	var prNumber;
	if(localStorage['OnReceiptFlag']=='true'){
		prNumber=$('#cor-step1-popup').find('#order-no').text();
	}else{
		prNumber=$('#preq-popup').find('#order-no').text();
	}
	
	var tokenUri = directUriPrefix+"ZSP_PR_TO_PO/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var tokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : tokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(tokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			convertToPO(prNumber, header_xcsrf_token);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		});
	
}

function convertToPO(prNumber, header_xcsrf_token){
	console.log(prNumber);
	var inputData="<?xml version='1.0' encoding='utf-8'?>" +
			"<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' " +
			"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' " +
			"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' " +
			"xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
			"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PR_TO_PO/'>" +
			"<atom:content type='application/xml'> " +
			"<m:properties>" +
			"<d:IV_PR_NO>"+prNumber+"</d:IV_PR_NO>" +
			"<d:IV_SITE>"+localStorage['site']+"</d:IV_SITE>" +
			"<d:IV_VENDOR>"+localStorage['PO_vendor']+"</d:IV_VENDOR>" +
			"<d:IV_DOC_TYPE>ZNB</d:IV_DOC_TYPE>" +
			"</m:properties> " +
			"</atom:content>" +
			"</atom:entry>";
	var convertToPOUri=directUriPrefix+'ZSP_PR_TO_PO/PR_TO_PO';
	console.log(inputData);
	console.log(convertToPOUri);
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	console.log("Header fields : ", oHeaders);

	$.ajax({
		url: convertToPOUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("Success! ");
			console.log('response :', response);
			console.log('data :', data);
			console.log(data.results);
				
				var msg=$(data).find("IV_MSG").text();
				if(msg==''){
					$('.loader').fadeOut(300);
					var orderNumber=$(data).find("IV_ORDER_NO").text();
					var vendor=$(data).find("IV_VENDOR").text();
					var orderType=$(data).find("IV_DOC_TYPE").text();
					localStorage['orderType']=orderType;
					localStorage['sendingStore']=vendor;
					localStorage['orderNo']=orderNumber;
					localStorage['orderStatus']="Authorised";
					if(localStorage['OnReceiptFlag']=='true'){
						$('#cor-step2-popup #order-no').text(orderNumber);
						$('#cor-step1-popup, #overlay').fadeOut();
						$('#cor-step2-popup, #overlay').fadeIn();
						
						centerAlign('#cor-step2-popup');
					}else{
						$('#preq-success-popup #order-no').text(orderNumber);
						$('#preq-success-popup, .overlay').fadeIn();
						centerAlign('#preq-success-popup');
					}
				}else{
					$('.loader').fadeOut(300);
					$('#error-popup .popup-msg').text('PO Conversion failed in SAP - '+msg);
					$('#error-popup, #overlay').fadeIn();
					centerAlign('#error-popup');
				}
		},
		error:  function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut(300);
			$('#error-popup .popup-msg').text('Server not responding');
			$('#error-popup, #overlay').fadeIn();
			centerAlign('#error-popup');
		}
	});
}
/*IBT to store */

/*------------------------Cancel Purchace Order Service starts ------------------------*/

function cancelPurchaseRequistionInputStr(){
	console.log('Edit Purchace Order Service');
	$(".loader,.overlay").fadeIn();
	var prNumber=localStorage['orderNo'];
	var site=localStorage['site'];
	 
		 inputStr ="<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' " +
		 		"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices'" +
		 		" xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'" +
		 		" xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
		 		"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PREQ_CANCEL/'>" +
		 		"<atom:content type='application/xml'>" +
		 		"<m:properties>" +
		 		"<d:IV_PREQ_NO>"+prNumber+"</d:IV_PREQ_NO>" +
		 		"<d:IV_SITE>"+site+"</d:IV_SITE> " +
		 		"<d:IV_TEST></d:IV_TEST>" +
		 		"</m:properties>" +
		 		"</atom:content>" +
		 		"</atom:entry>";
		 console.log('inputStr : ', inputStr);

		 getCancelPurchaseRequistionToken(inputStr);
}
function getCancelPurchaseRequistionToken(inputStr){
	var getCancelPurchaseRequistionTokenUri = directUriPrefix+"ZSP_PREQ_CANCEL/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getCancelPurchaseRequistionTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getCancelPurchaseRequistionTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getCancelPurchaseRequistionTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			cancelPurchaseRequistion(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
		}
	);
}

function cancelPurchaseRequistion(header_xcsrf_token, inputData){
	var cancelPurchaseRequistionUri=directUriPrefix+"ZSP_PREQ_CANCEL/PReqHeaders";

	$.ajax({
		url: cancelPurchaseRequistionUri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success:  function (data, response){
			var msg=$(data).find("IV_MSG").text();
			if(msg == ""){
			
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion ');
			$('#cancel-order-status #popup-msg').text('Purchase Requistion  cancelled successfully ');
			$('#cancel-order-status #OK').attr('onclick',"localStorage['fromAdvSearchPage']='false';localStorage['firstTimeSearch']='true';" +
					"localStorage['successReceive']='true';" +
					"localStorage['pageId']='viewOrder';" +
					"window.location='viewOrder.html';");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			}
			else{
				
				$('.loader').fadeOut();
				$('#cancel-order-status .head-title').text('Purchase Requistion');
				$('#cancel-order-status #popup-msg').text('Purchase Requistion cancellation failed due to SAP error - \n'+msg);
				$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
				$('.overlay, #cancel-order-status').fadeIn();
				centerAlign('#cancel-order-status');
			}
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Purchase Requistion Detail');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('.overlay, #cancel-order-status').fadeOut();");
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	
	});

}
/*------------------------ Cancel Purchace Order Service ends ------------------------*/
function openInvoicePage(){
	localStorage['pageId']='step1';
	window.location='step1.html';
}

function addItemToOrder(){
	console.log(localStorage['pageId']);
	localStorage['supplierType_addArticle']='vendor';
	localStorage['AA_sos']='1';
	localStorage['searchSupplier_addArticle'] = localStorage['AA_vendorDetails'].split(' | ')[0].replace(/^0+/, '');;
	localStorage['searchSupplierName_addArticle'] = localStorage['AA_vendorDetails'].split(' | ')[1];
	if(localStorage['pageId']=='listOfArticles'){
		if(localStorage['orderType']=='ZY'){
			localStorage['AA_type']='Preq';
		}else{
			localStorage['supplierType_addArticle']='warehouse';
			localStorage['AA_sos']='2';
			localStorage['searchSupplier_addArticle'] = localStorage['IBTAA_receivingStore'].split(' | ')[0].replace(/^0+/, '');
			localStorage['searchSupplierName_addArticle'] = localStorage['IBTAA_receivingStore'].split(' | ')[1];
			localStorage['AA_type']='IBT';
		}
	}else{
		localStorage['AA_type']='Order';
		
	}
	
	console.log('SN : ', localStorage['searchSupplier_addArticle'], localStorage['searchSupplierName_addArticle']);
	localStorage['displaySaved']='false';
	localStorage['pageId'] = 'addArticle';
	window.location='addArticle.html';
}

function populatePreqArticles(){
	var t = $(".srch-rslt-list ");
	var recCtnt = '';
	var packCtnt = '';
	var preqNo=localStorage['AA_orderNo'];
	if(!wool.tableExists("PreqArticleTable")){
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Orders to Display</div>';
		$('#content #itemList .srch-rslt-list').html(errMsg);
	}else{
		var searchResults = wool.query("PreqArticleTable", {
			PreqNo : preqNo
		});
		$(".totalArticle").text(searchResults.length);
		for ( var i = 0; i < (searchResults.length); i++) {
			console.log('searchResults.length : ', searchResults.length);
			var addedClass='';
			var addedItemFlagLength=localStorage['AA_addedItem'].split(" | ").length;
			var article=searchResults[i].ArticleNo;
			for(var j=0; j<addedItemFlagLength; j++){
				console.log('LocalStorage : ', localStorage['AA_addedItem'].split(" | ")[j], ' Article : ', article);
				if(localStorage['AA_addedItem'].split(" | ")[j]==article){
					addedClass=' added ';
				}
			}
			var description=searchResults[i].Description;
			var uom=searchResults[i].UOM;
			var item_no=searchResults[i].ItemNo;
			var order_qty=searchResults[i].OrderQty;
			var editDeldate=searchResults[i].DeliveryDate;
			var om=searchResults[i].OM;
			recCtnt ='<span class="" >Delivery Date.:</span>'
				+'<input type="text" class="editInput editInputBorder editDelDate" disabled value="'+editDeldate+'" />';
			editDeldate='';
			editableQdrQty='<input type="number" disabled class="editInput editQrdQty editInputBorder" value="'+order_qty+'" />';
			var additem='<div class="levelThree height100'+addedClass+'">'
				+'<div class="levelOne">'
				+'<table class="order-lst-itm fontHel font14 ranged">'
				+'<tbody>'
				+'<tr>'
				+'<td>'
				+'<span class="item-desc-txt">Article &nbsp;#</span>'
				+'<span class="item-desc-val articleNo">'+article+'</span>'
				//+packCtnt
				+'</td>'
				+'</tr>'
				+'<tr>'
				+'<td colspan="2" class="item-desc-val description">'
				+'<div class="to-lookup-Div">'+description+'</div>'
				+'<input type="hidden" class="uom" value="'+uom+'">'
				+'<input type="hidden" class="om" value="'+om+'">'
				+'<input type="hidden" class="articleItemNo" value="'+item_no+'">'
				+'</td>'
				+'</tr>'
				+'<tr>'
				+'<td colspan="2" class="item-desc-txt" >'
				+'<span class="" >Ordered Qty.:</span>'
				+editableQdrQty
				+'&nbsp;</td></tr><tr><td>'
				+recCtnt
				+packCtnt
				+'<div class="editPr editImgBtn"></div>'
				+'<div class="deletePr marR5 deleteImgBtn"></div>'
				+'</td>'
				+'</tr>'
				+editDeldate
				+'</tbody>'
				+'</table>'
				+'</div>'
				+'</div>';
			console.log(additem);
	        t.append(additem);
	        refreshScroll();	
		}
	}
	 refreshScroll();	
}

function deletePrArticle(){
	$('#delete-item-popup, .overlay').fadeOut();
	var selectedArticleNumber= $('#delete-item-popup .article-no').text();
	console.log('In deletePrArticle();');
	$.each($('.srch-rslt-list .levelThree '),function(){
		var orderItemNumber=$(this).find('.articleNo').text();
		console.log('selected : ', selectedArticleNumber, ' Order : ', orderItemNumber);
		if(selectedArticleNumber==orderItemNumber){
			console.log('match found');
			var numberoFitems=parseInt($('.totalArticle').text())-1;
			$('.totalArticle').text(numberoFitems);
			$(this).addClass('deleted');
			$(this).fadeOut();
		}
	});
}

/*------ RECEIVE ORDER FUNCTIONS - NIVEDHITHA ------*/

function getOrderDetails(){
	localStorage['vendorClaimNumber']='';
	console.log('In getOrderDetails');
	var orderNumber=localStorage['orderNo'];
	var orderType=localStorage['orderType'].trim();
	var orderStatus=localStorage['orderStatus'];
	console.log('Order Type : ', orderType, ' | Order Number : ', orderNumber);
	var getOrderDetailsUri;
	/*var orderStatus="";
	var deliveryFromDate="";
	var deliveryToDate="";
	var sos="";
	var supplier="";*/
	if(orderType =='ZY'){
		getOrderDetailsUri=uriPrefix+"ZSP_PR_ENQ_HEADER/zsp_pr_enq_headerCollection?$filter=iv_site eq '"+site+"' and iv_preq_no eq '"+orderNumber+"'";
	}else if(orderType =="ZUB"){
		getOrderDetailsUri =uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNumber+"' and iv_sos eq '2' and iv_supplier eq '"+site+"'";
	}else{
		getOrderDetailsUri =uriPrefix+"ZSP_ORDER_ENQ/zsp_order_enqCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNumber+"'";
	}
	console.log('URI : ', getOrderDetailsUri);
	var getOrderDetailsHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: getOrderDetailsUri, // OData endpoint URI
        method: "GET",
        timeoutMS : 200000
    };
    OData.request(getOrderDetailsHeader, 
    	function(data,response){
    		console.log(orderStatus);
    		console.log('Response : ', data.results[0]);
    		for(var i=0; i<=data.results.length-1; i++){
    			var deliveryDate=data.results[i].delivery_date;
    			console.log(deliveryDate);
    			$('#deliveryDate').text(deliveryDate);
	    		$('#deliveryStatus').text(data.results[i].delivery_status);
	    		if(orderType=='ZY'){
	    			$('#orderNumber').text(data.results[i].preq_no);
	    			if(data.results[i].order_no.length==0){
	    				$('#orderStatus').text('Open');
		    		}else{
		    			$('#orderStatus').text('Closed');
		    		}
	    		}else{
	    			$('#orderNumber').text(data.results[i].order_no);
	    			var orderStatusText=data.results[i].order_status;
	    			$('#orderStatus').text(orderStatusText);
	    			if(orderStatusText=='Cancelled'){
	    				$('.secondaryBtn').css("background-color", "#de6467");
	    			}
	    		}
	    		console.log('results: ', data.results[i]);
	    		localStorage['vendorClaimNumber']=data.results[i].vendor_claim;
	    		$('#vendorClaim').text(localStorage['vendorClaimNumber']);
	    		//$('#value').text(data.results[i].order_value);
	    		$('#receivedDate').text(data.results[i].recv_date);
	    		$('#receivingStore').text(data.results[i].recv_site+" | "+data.results[i].recv_site_desc);
	    		localStorage['IBTAA_receivingStore']=data.results[i].recv_site+" | "+data.results[i].recv_site_desc;
	    		$('#receivedTime').text(data.results[i].recv_time);
	    		$('#rosterDate').text(data.results[i].roster_date);
	    		$('#type').text(data.results[i].preq_type_desc);
	    		if(orderType=='ZUB'){
	    			$('#supplier').text(data.results[i].supp_no+" | "+data.results[i].supp_name);
	    			$('#sendingStore').text(data.results[i].supp_no+" | "+data.results[i].supp_name);
	    		}else{
	    			$('#supplier').text(data.results[i].supp_no+" | "+data.results[i].supp_name);
	    		}
	    		$('#temperature').text(data.results[i].gr_temp1);
	    		$('#temperature2').text(data.results[i].temp_check2);
	    		$('#totalCartons').text(data.results[i].total_cartons);
	    		$('#totalCartonsReceived').text(data.results[i].total_cartons_rcv);
	    		$('#totalPallets').text(data.results[i].total_pallets);
	    		$('#departmentName').text(data.results[i].trading_dep_name);
	    		$('#department').text(data.results[i].trading_dep_no);
	    		localStorage['departmentNo']=data.results[i].trading_dep_no;
    		}
    		if(orderType=='ZUB'){
    			$('.IBT').removeClass('hide');
    			if(orderStatus=='Received'){
    				$('.IBTReceived').removeClass('hide');
    			}
    		}else if(orderType=='ZY'){
    			$('.PReq').removeClass('hide');
    		}else if(orderType=='ZNB'){
    			if(orderStatus=='Received'){
    				$('.POReceived').removeClass('hide');
    			}else if(orderStatus=='Authorised'){
    				$('.POAuthorised').removeClass('hide');
    			}else if(orderStatus=='Cancelled'){
    				$('.POCancelled').removeClass('hide');
    			}
    		}
    		loadFooters();
    		checkTemperature();
    		setHeight();
    	    refreshScroll();
	    },function(err){
	    	$('.loader').fadeOut();
	    	$('#cancel-order-status .head-title').text('Order Details');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('#cancel-order-status #OK').attr('onclick',"$('#cancel-order-status,.overlay').fadeOut();");
			$('#cancel-order-status, .overlay').fadeIn();
			centerAlign('#cancel-order-status');
	    }
    );
    
}

function loadFooters(){
	console.log('Loading footers');
	var site = localStorage['site'];
	var sendingStore = localStorage['sendingStore'];
	var orderType=localStorage['orderType'].trim();
	var orderStatus=localStorage['orderStatus'].trim();
	if(orderType == "ZY"){
		if(orderStatus =="Open" ){
			addFooterItem ='<div onclick="cancelPurchaseRequistionInputStr();" class = "editList bottomLeft" >'
				   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
				   +'class = "editListImg padB5 txtCenter footerImage" /></div>\n'
				   +'<div class = "editListTxt fontWhite bold txtCenter" >'
		           +'<span class= "font14bottom" >Cancel PR</span>'
				   +'</div>'
				   +'</div>';
			addFooterItem3 ='<div onclick="editPurchaseOrder()" class = "editList bottomLeft" >'
					   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
					   +'class = "editListImg padB5 txtCenter footerImage" /></div>\n'
					   +'<div class = "editListTxt fontWhite bold txtCenter" >'
			           +'<span class= "font14bottom" >Update PR</span>'
					   +'</div>'
					   +'</div>';
		   addFooterItem2 ='<div onclick="createPurchaseOrder()" class = "editList bottomRight" >'
			   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
			   +'class = "editListImg padB5 txtCenter footerImage" /></div>\n'
			   +'<div class = "editListTxt fontWhite bold txtCenter" >'
	        +'<span class= "font14bottom" >Create PO</span>'
			   +'</div>'
			   +'</div>';
			addFooterItem4 ='<div onclick="addItemToOrder()" class = "editList bottomRight" >'
				   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
				   +'class = "editListImg padB5 txtCenter footerImage" /></div>\n'
				   +'<div class = "editListTxt fontWhite bold txtCenter" >'
		           +'<span class= "font14bottom" >Add Item</span>'
				   +'</div>'
				   +'</div>';
			var t = $(".Footer .container");
			var allowPOCreate='false';
			if(localStorage['pageId']=='orderDetail'){
				
				var rosterDate=$('#rosterDate').text();
				var rosterDateFormatted=new Date(rosterDate.split('.')[1]+"/"+rosterDate.split('.')[0]+"/"+rosterDate.split('.')[2]).setHours(0,0,0,0);
				var currentDate=new Date().setHours(0,0,0,0);
				if(rosterDateFormatted==currentDate){
					allowPOCreate='true';
				}
				localStorage['allowPOCreate']=allowPOCreate;
			}else{
				allowPOCreate=localStorage['allowPOCreate'];
			}
			console.log('allowPOCreate : ', allowPOCreate);
			if(localStorage['pageId']=='orderDetail'){
				t.append(addFooterItem);
				if(allowPOCreate=='true')
					t.append(addFooterItem2);
			}else{
				$('.container').css('height','140px');
				t.append(addFooterItem);
				t.append(addFooterItem3);
				t.append(addFooterItem4);
				if(allowPOCreate=='true')
					t.append(addFooterItem2);
				else{
					$('.bottomRight').css('width','98%');
				}
			}
			/*if(localStorage['pageId']=='orderDetail'){
				t.append(addFooterItem);
				t.append(addFooterItem2);
			}else{
				$('.container').css('height','140px');
				t.append(addFooterItem);
				t.append(addFooterItem3);
				t.append(addFooterItem4);
				t.append(addFooterItem2);
			}*/
		}else{
			var t = $(".Footer");
			t.remove();
		}
	}else{
		if(orderType =="ZUB"){
			var ibtType;
			if(site==sendingStore){
				ibtType='IBTOut';
			}else{
				ibtType='IBTIn';
			}
			console.log(orderType, ibtType);
			if(orderStatus =="Open" ){
				console.log('Sending Store : ', sendingStore);
				if(ibtType=='IBTOut'){
					if(localStorage['pageId']=='listOfArticles'){
						$('.container').css('height','210px');
					}else{
						$('.container').css('height','140px');
					}
					addFooterItem ='<div onclick="getSendFlow();" class = "editList bottomLeft" >'
								   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
								   +'class = "editListImg padB5 footerImage" /></div>\n'
								   +'<div class = "editListTxt fontWhite bold txtCenter" >'
								   +'<span>Send IBT</span>'
								   +'</div>'
								   +'</div>';
					addFooterItem2 ='<div onclick="confirmOrderCancellation()" class = "editList bottomRight" >'
									   +'<div class ="txtCenter"> <img src = "../images/iconCancelOrder.png" alt = "editList"'
									   +'class = "editListImg padB5 footerImage" /></div>\n'
									   +'<div class = "editListTxt fontWhite bold txtCenter" >'
									   +'<span>Cancel Order</span>'
									   +'</div>'
									   +'</div>';
					addFooterItem3 ='<div onclick="showEditDeliveryDate()" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/editDetailIcon.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Edit Delivery Date</span>'
						   +'</div>'
						   +'</div>';
					addFooterItem4 ='<div onclick="showEditDeliveryDate()" class = "editList bottomLeft boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/editDetailIcon.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Edit Delivery Date</span>'
						   +'</div>'
						   +'</div>';
					addFooterItem5 ='<div onclick="addItemToOrder()" class = "editList bottomRight" >'
						   +'<div class ="txtCenter"> <img src = "../images/editDetailIcon.png" alt = "editList"'
						   +'class = "editListImg padB5 txtCenter footerImage" /></div>\n'
						   +'<div class = "editListTxt fontWhite bold txtCenter" >'
				           +'<span class= "font14bottom" >Add Item</span>'
						   +'</div>'
						   +'</div>';
					addFooterItem6 ='<div onclick="updateOrderItems()" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/iconFinalise.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Update IBT</span>'
						   +'</div>'
						   +'</div>';
					var t = $(".Footer .container");
					t.append(addFooterItem);
					t.append(addFooterItem2);
					if(localStorage['pageId']=='listOfArticles'){
						t.append(addFooterItem4);
						t.append(addFooterItem5);
						t.append(addFooterItem6);
					}else{
						t.append(addFooterItem3);
					}
					
					console.log('Append 3 footers');
					/*$('.bottomLeft').css('height','100%');
					$('.bottomRight').css('height','100%');*/
				}else{
					addFooterItem ='<div onclick="showEditDeliveryDate()" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/editDetailIcon.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Edit Delivery Date</span>'
						   +'</div>'
						   +'</div>';
					var t = $(".Footer .container");
					t.append(addFooterItem);
				}	
			}else if(orderStatus =="Authorised" ){
				if(ibtType=='IBTIn'){
					addFooterItem ='<div onclick="getReceiveFlow()" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/iconReceiveOrder.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Receive Order</span>'
						   +'</div>'
						   +'</div>';
					var t = $(".Footer .container");
					t.append(addFooterItem);
				}else{
					var t = $(".Footer");
							t.remove();
				}	
			
			}else{
				var t = $(".Footer");
				t.remove();
			}
		}else{
			/*if(orderStatus =="Open" ){
				addFooterItem ='<div onclick="finalizeOrderReceipt()" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
					   +'<img src = "../images/editDetailIcon.png" alt = "editList"'
					   +'class = "editListImg padB5 footerImage" />\n'
					   +'<div class = "editListTxt fontWhite bold" >'
					   +'<span>Edit Delivery Date</span>'
					   +'</div>'
					   +'</div>';
				t.append(addFooterItem);
			}*/
			if(orderStatus =="Authorised"){
				$('.container').css('height','60px');
				addFooterItem ='<div onclick="getReceiveFlow()" class = "editList bottomLeft" >'
					   +'<div class ="txtCenter"> <img src = "../images/iconReceiveOrder.png" alt = "editList"'
					   +'class = "editListImg padB5 footerImage" /></div>\n'
					   +'<div class = "editListTxt fontWhite bold txtCenter" >'
					   +'<span class="myriadPro">Receive Order</span>'
					   +'</div>'
					   +'</div>';
				addFooterItem2 ='<div onclick="confirmOrderCancellation()" class = "editList bottomRight" >'
						   +'<div class ="txtCenter"> <img src = "../images/iconCancelOrder.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" /></div>\n'
						   +'<div class = "editListTxt fontWhite bold txtCenter" >'
						   +'<span>Cancel Order</span>'
						   +'</div>'
						   +'</div>';
				var t = $(".Footer .container");
				t.append(addFooterItem);
				t.append(addFooterItem2);
				$('.bottomLeft').css('height','100%');
				$('.bottomRight').css('height','100%');
			}else if(orderStatus =="Received"){
				if(localStorage['vendorClaimNumber'].length==0){
					addFooterItem ='<div onclick="showVendorAuthorization();" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/iconReceiveOrder.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Vendor Authorization #</span>'
						   +'</div>'
						   +'</div>';
					var t = $(".Footer .container");
					t.append(addFooterItem);
				}else{
					$('.vendorClaimContainer').show();
					addFooterItem ='<div onclick="showVendorAuthorization();" class = "editList boxDisp boxAlign boxPack boxOrient padL20 padR20" >'
						   +'<img src = "../images/iconReceiveOrder.png" alt = "editList"'
						   +'class = "editListImg padB5 footerImage" />\n'
						   +'<div class = "editListTxt fontWhite bold" >'
						   +'<span>Edit Vendor Authorization #</span>'
						   +'</div>'
						   +'</div>';
					var t = $(".Footer .container");
					t.append(addFooterItem);
				}
			}else{
				var t = $(".Footer");
				t.remove();
			}
			
		}
	}
}

function orderFooterToggle() {
	console.log('In orderFooterToggle');
	$('.container').slideToggle("200");
	if (!($('.container').hasClass('.hide'))){
		$('.container').css('display', 'block');
	}
}

function getOrderArticles(){
	if(!wool.tableExists("OrderArticleTable")){
		 console.log('OrderArticleTable does not exist');
		 wool.createTable("OrderArticleTable", ["ArticleNo", "Quantity", "EditableField", "ButtonState"]);
			console.log('OrderArticleTable created');
			wool.commit();
	}
	if(!wool.tableExists("DeletedArticleTable")){
		 console.log('DeletedArticleTable does not exist');
			wool.createTable("DeletedArticleTable", ["ArticleNo"]);
			console.log('DeletedArticleTable created');
			wool.commit();
	}
	console.log('In getOrderDetails');
	var orderNumber=localStorage['orderNo'];
	var orderType=localStorage['orderType'].trim();
	var orderStatus=localStorage['orderStatus'].trim();
	var sendingStore = localStorage['sendingStore'];
	console.log('Order Type : ', orderType, ' | Order Number : ', orderNumber);
	var data = JSON.parse(localStorage['RO_articleData']);
	console.log(data.results);
	var resultsLength=data.results.length;
	$('.articleCount').text(resultsLength);
	if(orderType=='ZY'){
		for(var i=0; i<resultsLength; i++){
			var deletedFlag='';
			var articleNumber=data.results[i].article.replace(/^0+/, '');
			var orderQuantity=data.results[i].order_qty;
			var deliveryDate=data.results[i].delivery_date.split('.');
			deliveryDate=deliveryDate[2]+"-"+deliveryDate[1]+"-"+deliveryDate[0];
			if(wool.tableExists("DeletedArticleTable")){
        		if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length>0){
        			deletedFlag=' deleted hide ';
        		}
        	}
			var buttonState='../images/editButton.png';
			var disabledState='disabled';
            var savedFlag='';
			if(wool.tableExists("OrderArticleTable")){
				if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length==0){
					if(wool.query("OrderArticleTable",{ArticleNo : articleNumber}).length==0){
						wool.insert('OrderArticleTable', {
							ArticleNo: articleNumber,
							Quantity: orderQuantity,
							EditableField: deliveryDate, 
							ButtonState: 'save'
						});
						wool.commit();
					}else{
						var searchResults=wool.query("OrderArticleTable",{ArticleNo : articleNumber});
						orderQuantity=searchResults[0].Quantity;
						deliveryDate=searchResults[0].EditableField;
						buttonState=searchResults[0].ButtonState;
						if(buttonState=='save'){
							buttonState='../images/editButton.png';
							disabledState='disabled';
				            savedFlag='';
						}else{
							buttonState='../images/saveButton.png';
							disabledState='';
				            editInputBorderState='unsaved';
						}
					}
				}
			}
			console.log('results: ', data.results[i]);
			var articleItemNumber=data.results[i].item_no.replace(/^0+/, '');
			var description=data.results[i].article_desc;
			var orderMultiple=data.results[i].order_multiple;
			var totalOrdered=data.results[i].tot_order_qty;
			var rosterDate=data.results[i].date_created;
			var uom=data.results[i].uom;
			if(uom.toUpperCase()!='KG'){
				totalOrdered=~~totalOrdered;
				orderQuantity=~~orderQuantity;
				orderMultiple=~~orderMultiple;
			}
			var orderArticleItem='<div class="margin-top10'+deletedFlag+'details-section '+savedFlag+' borderRad4 font14 levelThree">'
					+'<div class="width100 art-section">'
					+'<div class="width48 inlineBlock margin-left15 dark-green normal"><label>Article #</label>'
					+'<span class="articleNumber">'+articleNumber+'</span>'
					+'</div>'
					+'<div class="text-left margin-left15 margin-top5 dark-green bold">'
					+'<span class="description green">'+description+'</span>'
					+'</div>'
					+'</div>'
					+'<div class="qty-section width100">'
					+'<div class="width30 inlineBlock margin-left15"><div class="margin-top10 gray-text">Order Qty.</div><div class="boxDisp boxAlign width48 item-val looupFont normalN"><input '+disabledState+' class="edit-fields width50px search-field editQrdQty orderListTxt" type="text" value="'+orderQuantity+'" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></div></div>'
					+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Order Multiple</div><div class="margin-top5 margin-bottom10 margin-left15 om">'+orderMultiple+'</div></div>'
					+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Total Ordered</div><div class="margin-top5 margin-bottom10 margin-left15">'+totalOrdered+' &nbsp;<span class="uom">'+uom+'</span></div></div>'
					+'</div>'	
					+'<div class="qty-section width100">'
					+'<div class="height40 padding10 boxDisp border-bottom-gray"><div class="padding10  boxDisp boxAlign width50 text-align-left">Roster Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normal" >'+rosterDate+'</div></div>'
					+'<div class="height40 boxDisp border-bottom-gray"><div class="padding10  boxDisp boxAlign text-align-left width50">Delivery Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" ><input value="'+deliveryDate+'" '+disabledState+' class="editDelDate search-field  edit-fields orderListTxt date-field" type="date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></div></div>'
					+'</div>'
					+'<div class="width100 more-section action-btn-div page-bg ">'
					+'<div class="margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"></div>'
					+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delete-btn" ></div>'
					+'<div class="inlineBlock float-right"><img src="'+buttonState+'"  alt="div-bar" class="edit-save action-btn" ></div>'
					+'</div><input  class="articleItemNo" type="hidden" value="'+articleItemNumber+'">'				
					+'</div>';
			$('.content').append(orderArticleItem);
		}
		
		if(localStorage['AA_itemAddedFlag'].trim().length>0){
			//$('.content').append(localStorage['AA_addedDom']);
			var orderArticleItem;
			if(localStorage['AA_addedDom'].split(' || ').length>1){
				for(var n=0; n<=localStorage['AA_addedDom'].split(' || ').length-1; n++){
					orderArticleItem=localStorage['AA_addedDom'].split(' || ')[n];
					$('.content').append(orderArticleItem);
				}
			}else{
				$('.content').append(localStorage['AA_addedDom']);
			}
			setHeight();
			refreshScroll();
			$('.levelThree').each(function(){
					if($(this).hasClass('added')){
   					var articleNumber=($(this).find('.articleNumber').text());
   					if(wool.tableExists("OrderArticleTable")){
   						var searchResults=wool.query("OrderArticleTable",{ArticleNo : articleNumber});
   						$(this).find('.editQrdQty').val(searchResults[0].Quantity);
   						$(this).find('.editDelDate').val(searchResults[0].EditableField);
   						buttonState=searchResults[0].ButtonState;
   						if(buttonState=='save'){
   							if($(this).find('.edit-save').attr('src')=='../images/saveButton.png'){
   								var target = $(this).find('.edit-fields');
   								$(this).find('.edit-save').attr('src','../images/editButton.png');
   								target.attr('disabled','disabled');
   								target.removeClass('unsaved');
   							}
   						}else{
   							if($(this).find('.edit-save').attr('src')=='../images/editButton.png'){
   								var target = $(this).find('.edit-fields');
   								$(this).find('.edit-save').attr('src','../images/saveButton.png');
   								target.removeAttr('disabled');
   								target.addClass('unsaved');
   							}
   						}
   					}
   				}
   			});
			$('.articleCount').text(wool.query('OrderArticleTable').length);
			$('.levelThree').each(function(){
				if($(this).find('.edit-save').attr('src')=='../images/saveButton.png'){
					var target = $(this).find('.edit-fields');
					target.attr('disabled','disabled');
					target.removeClass('unsaved');
				}
				else if($(this).find('.editSaveBtn').hasClass('editImgDiv')){
					var target = $(this).find('.edit-fields');
					target.removeAttr('disabled');
					target.addClass('unsaved');
				}
			}); 
		}
	}else if(orderType=='ZUB' && orderStatus=='Open' && site==sendingStore){
		for(var i=0; i<resultsLength; i++){
			var deletedFlag='';
			var articleNumber=data.results[i].article.replace(/^0+/, '');
			var orderQuantity=data.results[i].order_qty;
			var deliveryDate=data.results[i].delivery_date.split('.');
			deliveryDate=deliveryDate[2]+"-"+deliveryDate[1]+"-"+deliveryDate[0];
			if(wool.tableExists("DeletedArticleTable")){
        		if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length>0){
        			deletedFlag=' deleted hide ';
        		}
        	}
			var buttonState='../images/editButton.png';
			var disabledState='disabled';
            var savedFlag='';
			if(wool.tableExists("OrderArticleTable")){
				if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length==0){
					if(wool.query("OrderArticleTable",{ArticleNo : articleNumber}).length==0){
						wool.insert('OrderArticleTable', {
							ArticleNo: articleNumber,
							Quantity: orderQuantity,
							EditableField: deliveryDate, 
							ButtonState: 'save'
						});
						wool.commit();
					}else{
						var searchResults=wool.query("OrderArticleTable",{ArticleNo : articleNumber});
						orderQuantity=searchResults[0].Quantity;
						deliveryDate=searchResults[0].EditableField;
						buttonState=searchResults[0].ButtonState;
						if(buttonState=='save'){
							buttonState='../images/editButton.png';
							disabledState='disabled';
				            savedFlag='';
						}else{
							buttonState='../images/saveButton.png';
							disabledState='';
				            editInputBorderState='unsaved';
						}
					}
				}
			}
			console.log('results: ', data.results[i]);
			var articleNumber=data.results[i].article.replace(/^0+/, '');
			var vendorNumber=data.results[i].vendor_ref_no;
			var description=data.results[i].article_desc;
			var orderQuantity=data.results[i].order_qty;
			var dispatchQuantity=data.results[i].despatch_qty;
			var receivedQuantity=data.results[i].received_qty;
			var unsuppliedQty=data.results[i].unsupplied_qty;
			var allocatedQty=data.results[i].allocated_qty;
			var stockonHand=data.results[i].stock_on_hand;
			var stockonOrder=data.results[i].stock_on_order;
			var stockInTransist=data.results[i].stock_in_transit;
			var orderMultiple=data.results[i].order_multiple;
			var orderUom=data.results[i].order_uom;
			var articleItemNumber=data.results[i].item_no.replace(/^0+/, '');
			if(orderUom.toUpperCase()!='KG'){
				orderQuantity=~~orderQuantity;
				dispatchQuantity=~~dispatchQuantity;
				receivedQuantity=~~receivedQuantity;
				unsuppliedQty=~~unsuppliedQty;
				allocatedQty=~~allocatedQty;
			}
			var orderArticleItem='<div id="order-artcle-item" class="levelThree '+deletedFlag+'details-section '+savedFlag+'  borderRad4 margin-top10 marB10 font14">'
			
			+'<div class="width100 art-section">'
			+'<div class="width48 inlineBlock margin-left15 green normal">'
			+'<label>Article #</label>'
			+'<span class="articleNumber">'+articleNumber+'</span>'
			+'<input  class="articleItemNo" type="hidden" value="'+articleItemNumber+'">'	
			+'</div>'
			+'<div class="width48 inlineBlock absolute rightZero grey marR5px txtRight">'
			+'<label>Vendor Ref #</label>'
			+'<span class="vendorNumber">'+vendorNumber+'</span>'
			+'</div>'
			+'<div class="text-left margin-left15 margin-top5 bold">'
			+'<span class="description green">'+description+'</span>'
			+'</div>'
			+'</div>'
			+'<div class="qty-section width100">'
			+'<div class="width33 inlineBlock txtLft">'
			+'<div class="margin05 marL10px grey">Order Qty.</div>'
			+'<div class="margin05 marL10px"><input '+disabledState+' class="edit-fields ibtedit width50px search-field editQrdQty orderListTxt" type="text" value="'+orderQuantity+'" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" > <span class="cartons uom">'+orderUom+'</span></div>'
			+'</div>'
			+'<div class="width33 inlineBlock  border-left-gray txtLft">'
			+'<div class=" margin05 marL10px grey">Dispatch Qty.</div>'
			+'<div class="margin05 marL10px"><span class="dispatchQuantity">'+dispatchQuantity+'</span> <span class="cartons">'+orderUom+'</span></div></div>'
			+'<div class="width33 inlineBlock  border-left-gray txtLft">'
			+'<div class=" margin05 marL10px grey">Received Qty.</div>'
			+'<div class="margin05 marL10px"><span class="receivedQuantity">'+receivedQuantity+'</span> <span class="cartons">'+orderUom+'</span></div>'
			+'</div>'
			+'</div>'
			+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delete-btn" ></div>'
			+'<div class="inlineBlock float-right"><img src="'+buttonState+'"  alt="div-bar" class="edit-save action-btn" ></div>'
			+'<div class="width100 more-section page-bg">'
			+'<div class="list-moreToggle margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal" ><div class="inlineBlock"><img src="../images/LookUp_DownArrow.png" id="more-img" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">more details</div></div>'
			+'<div id="more-details" class=" boxDisp boxOrient borderTop hide">'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Unsupplied Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="unsuppliedQty">'+unsuppliedQty+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Allocated Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="allocatedQty">'+allocatedQty+'</div></div>'
			+'</div>'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SOH:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonHand">'+stockonHand+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">SOO:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonOrder">'+stockonOrder+'</div></div>'
			+'</div>'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SIT:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockInTransist">'+stockInTransist+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">OM:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="orderMultiple">'+orderMultiple+'</div></div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
			$('.content').append(orderArticleItem);
		}
		
		if(localStorage['AA_itemAddedFlag'].trim().length>0){
			//$('.content').append(localStorage['AA_addedDom']);
			var orderArticleItem;
			if(localStorage['AA_addedDom'].split(' || ').length>1){
				for(var n=0; n<=localStorage['AA_addedDom'].split(' || ').length-1; n++){
					orderArticleItem=localStorage['AA_addedDom'].split(' || ')[n];
					$('.content').append(orderArticleItem);
				}
			}else{
				$('.content').append(localStorage['AA_addedDom']);
			}
			setHeight();
			refreshScroll();
			$('.levelThree').each(function(){
					if($(this).hasClass('added')){
   					var articleNumber=($(this).find('.articleNumber').text());
   					if(wool.tableExists("OrderArticleTable")){
   						var searchResults=wool.query("OrderArticleTable",{ArticleNo : articleNumber});
   						if(searchResults.length>0){
	   						$(this).find('.editQrdQty').val(searchResults[0].Quantity);
	   						$(this).find('.editDelDate').val(searchResults[0].EditableField);
	   						buttonState=searchResults[0].ButtonState;
	   						if(buttonState=='save'){
	   							if($(this).find('.edit-save').attr('src')=='../images/saveButton.png'){
	   								var target = $(this).find('.edit-fields');
	   								$(this).find('.edit-save').attr('src','../images/editButton.png');
	   								target.attr('disabled','disabled');
	   								target.removeClass('unsaved');
	   							}
	   						}else{
	   							if($(this).find('.edit-save').attr('src')=='../images/editButton.png'){
	   								var target = $(this).find('.edit-fields');
	   								$(this).find('.edit-save').attr('src','../images/saveButton.png');
	   								target.removeAttr('disabled');
	   								target.addClass('unsaved');
	   							}
	   						}
	   					}
   					}
   				}
   			});
			$('.articleCount').text(wool.query('OrderArticleTable').length);
			$('.levelThree').each(function(){
				if($(this).find('.edit-save').attr('src')=='../images/saveButton.png'){
					var target = $(this).find('.edit-fields');
					target.attr('disabled','disabled');
					target.removeClass('unsaved');
				}
				else if($(this).find('.editSaveBtn').hasClass('editImgDiv')){
					var target = $(this).find('.edit-fields');
					target.removeAttr('disabled');
					target.addClass('unsaved');
				}
			}); 
		}
	}else{
		for(var i=0; i<resultsLength; i++){
			var articleNumber=data.results[i].article.replace(/^0+/, '');
			var vendorNumber=data.results[i].vendor_ref_no;
			var description=data.results[i].article_desc;
			var orderQuantity=data.results[i].order_qty;
			var dispatchQuantity=data.results[i].despatch_qty;
			var receivedQuantity=data.results[i].received_qty;
			var unsuppliedQty=data.results[i].unsupplied_qty;
			var allocatedQty=data.results[i].allocated_qty;
			var stockonHand=data.results[i].stock_on_hand;
			var stockonOrder=data.results[i].stock_on_order;
			var stockInTransist=data.results[i].stock_in_transit;
			var orderMultiple=data.results[i].order_multiple;
			var orderUom=data.results[i].order_uom;
			console.log('order_uom : ', orderUom);
			if(orderUom.toUpperCase()!='KG'){
				dispatchQuantity=~~dispatchQuantity;
				orderQuantity=~~orderQuantity;
				receivedQuantity=~~receivedQuantity;
				unsuppliedQty=~~unsuppliedQty;
				allocatedQty=~~allocatedQty;
				orderMultiple=~~orderMultiple;
			}
			var orderArticleItem='<div id="order-artcle-item" class="details-section borderRad4 margin-top10 marB10 font14">'
			
			+'<div class="width100 art-section">'
			+'<div class="width48 inlineBlock margin-left15 green normal">'
			+'<label>Article #</label>'
			+'<span class="articleNumber">'+articleNumber+'</span>'
			+'</div>'
			+'<div class="width48 inlineBlock absolute rightZero grey marR5px txtRight">'
			+'<label>Vendor Ref #</label>'
			+'<span class="vendorNumber">'+vendorNumber+'</span>'
			+'</div>'
			+'<div class="text-left margin-left15 margin-top5 bold">'
			+'<span class="description green">'+description+'</span>'
			+'</div>'
			+'</div>'
			+'<div class="qty-section width100">'
			+'<div class="width33 inlineBlock txtLft">'
			+'<div class="margin05 marL10px grey">Order Qty.</div>'
			+'<div class="margin05 marL10px"><span class="orderQuantity">'+orderQuantity+'</span> <span class="cartons">'+orderUom+'</span></div>'
			+'</div>'
			+'<div class="width33 inlineBlock  border-left-gray txtLft">'
			+'<div class=" margin05 marL10px grey">Dispatch Qty.</div>'
			+'<div class="margin05 marL10px"><span class="dispatchQuantity">'+dispatchQuantity+'</span> <span class="cartons">'+orderUom+'</span></div></div>'
			+'<div class="width33 inlineBlock  border-left-gray txtLft">'
			+'<div class=" margin05 marL10px grey">Received Qty.</div>'
			+'<div class="margin05 marL10px"><span class="receivedQuantity">'+receivedQuantity+'</span> <span class="cartons">'+orderUom+'</span></div>'
			+'</div>'
			+'</div>'
			+'<div class="width100 more-section page-bg">'
			+'<div class="list-moreToggle margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal" ><div class="inlineBlock"><img src="../images/LookUp_DownArrow.png" id="more-img" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">more details</div></div>'
			+'<div id="more-details" class=" boxDisp boxOrient borderTop hide">'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Unsupplied Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="unsuppliedQty">'+unsuppliedQty+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Allocated Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="allocatedQty">'+allocatedQty+'</div></div>'
			+'</div>'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SOH:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonHand">'+stockonHand+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">SOO:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonOrder">'+stockonOrder+'</div></div>'
			+'</div>'
			+'<div class = " boxDisp borderBottom " >'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SIT:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockInTransist">'+stockInTransist+'</div></div>'
			+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">OM:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="orderMultiple">'+orderMultiple+'</div></div>'
			+'</div>'
			+'</div>'
			+'</div>'
			+'</div>';
			$('.content').append(orderArticleItem);
		}
	}
	$('.overlay, .loader').fadeOut();
}

function checkTemperature(){
	console.log('In tempCheck');
	var orderNumber=localStorage['orderNo'];
	var orderType=localStorage['orderType'].trim();
	console.log('Order Type : ', orderType, ' | Order Number : ', orderNumber);
	var getOrderArticlesUri;
	if(orderType =='ZY'){
		getOrderArticlesUri=uriPrefix+"ZSP_PR_ENQ_ITEM/zsp_pr_enq_itemCollection?$filter=iv_site eq '"+site+"' and iv_preq_no eq '"+orderNumber+"'";
	}else if(orderType =="ZUB"){
		getOrderArticlesUri =uriPrefix+"ZSP_ORDER_ENQ_ITM/zsp_order_enq_itmCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNumber+"' and iv_sos eq '2' and iv_supplier eq '"+site+"'";
	}else{
		getOrderArticlesUri =uriPrefix+"ZSP_ORDER_ENQ_ITM/zsp_order_enq_itmCollection?$filter=iv_site eq '"+site+"' and iv_order_type eq '"+orderType+"' and iv_order_no eq '"+orderNumber+"'";
	}
	console.log('URI : ', getOrderArticlesUri);
	var getOrderArticlesHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: getOrderArticlesUri, // OData endpoint URI
        method: "GET",
        timeoutMS : 200000
    };
    OData.request(getOrderArticlesHeader, 
    	function(data, response){
    		console.log(data.results);
    		var resultsLength=data.results.length;
    		$('.articleCount').text(resultsLength);
    		var tempCheckFlag=false;
			var minTemp='';
			var maxTemp='';
			localStorage['RO_articleData']=JSON.stringify(data);
			for(var i=0; i<resultsLength; i++){
				$('#grn').text(data.results[i].grn);
				$('#invoiceNumber').text(data.results[i].ven_invoice);
				$('#invoiceTotal').text(data.results[i].invoice_total);
				$('#gst').text(data.results[i].gst_amount);
				$('#deliveryDocketNo').text(data.results[i].del_doc_no);
				$('#gst').text(data.results[i].gst_amount);
				$('#creationDate').text(data.results[i].date_created);
				temperature=data.results[i].temperature;
				console.log(temperature);
				if(temperature!='' && temperature!=undefined && temperature!='undefined'){
					tempCheckFlag=true;
					var temp1=parseInt(temperature.split('(')[1].split(')')[0].split(' to ')[0]);
					var temp2=parseInt(temperature.split('(')[1].split(')')[0].split(' to ')[1]);
					if(minTemp==''){
						minTemp=temp1;
					}else if(parseInt(minTemp)>temp1){
						minTemp=temp1;
					}
					if(maxTemp==''){
						maxTemp=temp2;
					}else if(parseInt(maxTemp)<temp1){
						maxTemp=temp2;
					}
				}
			}
			console.log('TempChkFlag : ', tempCheckFlag, ' | minTemp : ', minTemp, ' | maxTemp : ', maxTemp);
			localStorage['RO_tempCheckFlag']=tempCheckFlag;
			localStorage['RO_minTemp']=minTemp;
			localStorage['RO_maxTemp']=maxTemp;
			if(localStorage['TC_orderType'].trim().length>0){
				if(orderType=='ZUB'){
					getSendFlow();
				}else{
					getReceiveFlow();
				}
			}
			localStorage['AA_NoOfItems_initial']=$('.articleCount').text();
			localStorage['AA_DeliveryDate']=$('#deliveryDate').text();
			localStorage['AA_vendorDetails']=$('#supplier').text();
			$('.overlay, .loader').fadeOut();
		}, function(err){
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}

function getReceiveFlow(){
	console.log('In getReceiveFlow');
	var tempCheckFlag=localStorage['RO_tempCheckFlag'];
	var orderType=localStorage['orderType'];
	if(orderType == "ZUB"){
		console.log('In IBT');
		if(tempCheckFlag=='true'){
			localStorage['S3_actionType']='ReceiveOrder';
			console.log('In TempChk True');
			localStorage['pageId']='step3';
			window.location='step3.html';
		}else{
			console.log('In TempChk false');
			localStorage['pageId']='receiveOrder';
			window.location='receiveOrder.html';
		}
	}else{
		$('.loader').fadeOut();
		$('#editInvno-popup, .overlay').fadeIn();
		centerAlign('#editInvno-popup');
	}
}

function getSendFlow(){
	$('.overlay, .loader').fadeIn();
	console.log('In getSendFlow');
	var tempCheckFlag=localStorage['RO_tempCheckFlag'];
	if(tempCheckFlag=='true'){
		localStorage['S3_actionType']='SendIBT';
		console.log('In TempChk True');
		localStorage['pageId']='step3';
		window.location='step3.html';
	}else{
		console.log('In TempChk false');
		confirmSendIbtOrder();
	}
}

function confirmOrderCancellation(){
	$('#two-button-popup #popup-msg').text('Are you sure you want to cancel the order?');
	$('#two-button-popup #yes').attr('onclick',"confirmCancelOrder();");
	$('#two-button-popup, .overlay').fadeIn();
	centerAlign('#two-button-popup');
}

function showEditDeliveryDate(){
	$('#edit-delivery-date-popup .current-delivery-date').text($('#deliveryDate').text());
	$('#edit-delivery-date-popup, .overlay').fadeIn();
	centerAlign('#edit-delivery-date-popup');
	$('.new-delivery-date').focus();
}

function editDeliveryDate(){
	console.log('In editDeliveryDate');
	var newDeliveryDate=$('#edit-delivery-date-popup .new-delivery-date').val();
	var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    var newDeliveryDateFormatted=new Date(newDeliveryDate).toISOString().slice(0,10).replace(/-/g,"");
    var newDeliveryDateDotFormatted=newDeliveryDate.split('-')[2]+"."+newDeliveryDate.split('-')[1]+"."+newDeliveryDate.split('-')[0];
    $('#edit-delivery-date-popup').fadeOut();
    if(newDeliveryDate==''){
    	$('#one-button-popup .head-title').text('Edit delivery date');
    	$('#one-button-popup #popup-msg').text('Please enter delivery date');
		$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();showEditDeliveryDate();");
		$('.overlay, #one-button-popup').fadeIn();
		centerAlign('#one-button-popup');
    }else if(newDeliveryDate<today){
    	$('#one-button-popup .head-title').text('Edit delivery date');
    	$('#one-button-popup #popup-msg').text('Delivery date cannot be past date');
		$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();showEditDeliveryDate();");
		$('.overlay, #one-button-popup').fadeIn();
		centerAlign('#one-button-popup');
    }else{
    	$('.overlay, .loader').fadeIn();
    	var inputStr = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n'
    		+'<atom:entry xml:lang="en"  xmlns:atom="http://www.w3.org/2005/Atom"\n'
    		+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
    		+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
    		+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n' 
    		+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_DELIVERY_DATE_UPDATE/">\n'
    		+'<atom:content type="application/xml">\n'
    		+'<m:properties>\n'
    		+'<d:IV_PO_NO>'+localStorage["orderNo"]+'</d:IV_PO_NO>\n'
    		+'<d:IV_DELIVERY_DATE>'+newDeliveryDateFormatted+'</d:IV_DELIVERY_DATE>\n'
    		+'</m:properties>\n'
    		+'</atom:content>\n'
    		+'</atom:entry>';
    	console.log(newDeliveryDate, newDeliveryDateFormatted, newDeliveryDateDotFormatted);
    	getDeliveryDateUpdateToken(inputStr, newDeliveryDateDotFormatted);
    }
    
    function getDeliveryDateUpdateToken(inputStr, newDeliveryDate){
    	var getDeliveryDateUpdateTokenUri = directUriPrefix+"ZSP_DELIVERY_DATE_UPDATE/";
    	//var getOpenOrderUpdateTokenUri = uriPrefix+"ZSP_DELIVERY_DATE_UPDATE/";
    	var oHeaders = {};
    	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
    	oHeaders['Accept'] = "application/json";
    	oHeaders['X-CSRF-Token'] = "fetch";
    	var getdeliveryDateUpdateTokenHeader = {
    		headers : oHeaders, // object that contains HTTP headers as name value pairs
    		requestUri : getDeliveryDateUpdateTokenUri, // OData endpoint URI
    		method : "GET"
    	};
    	OData.request(getdeliveryDateUpdateTokenHeader,
    		function (data, response){
    			var header_xcsrf_token = response.headers['x-csrf-token'];
    			console.log("Token : ",header_xcsrf_token);
    			deliveryDateUpdate(header_xcsrf_token, inputStr, newDeliveryDate);
    		},function(err) {
    			$('.loader').fadeOut();
    			$('#one-button-popup .head-title').text('Error');
    			$('#one-button-popup #popup-msg').text('Server not responding');
    			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
    			$('.overlay, #one-button-popup').fadeIn();
    			centerAlign('#one-button-popup');
    		}
    	);
    }
}

function deliveryDateUpdate(token,inputStr, newDeliveryDate){
	var deliveryDateUpdateUri =  directUriPrefix+"ZSP_DELIVERY_DATE_UPDATE/DELDATE";
	$.ajax({
		url: deliveryDateUpdateUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', token);	
		},
		dataType: "xml",
		data:inputStr,
		contentType: "application/atom+xml",
		success:function(data,response){
			if($(data).find('IV_MSG').text().trim().length>3){
				$('.loader').fadeOut();
				   $('#one-button-popup .head-title').text('Error');
				   $('#one-button-popup #popup-msg').text('Delivery date update failed due to SAP Error - '+$(data).find('IV_MSG').text());
				   $('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				   $('.overlay, #one-button-popup').fadeIn();
				   centerAlign('#one-button-popup');
			}else{
				$('#deliveryDate').text(newDeliveryDate);
				$('.overlay, .loader').fadeOut();
				$('#one-button-popup .head-title').text('Success');
				$('#one-button-popup #popup-msg').text('Delivery date updated successfully');
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
				console.log("Open Order update successful.");
			}
		},
	   error :function(err){
		   $('.loader').fadeOut();
		   $('#one-button-popup .head-title').text('Error');
		   $('#one-button-popup #popup-msg').text('Server not responding');
		   $('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
		   $('.overlay, #one-button-popup').fadeIn();
		   centerAlign('#one-button-popup');
	   }
	});
}

function ibtToStoreInputStr(){
	$('.overlay, .loader').fadeIn();
	centerAlign('.loader');
	var date='';
	var orderNo=localStorage['orderNo'];
	var site=localStorage['site'];
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
	var currentDay=('0' + currentDate.getDate()).slice(-2);
	date=currentYear+currentMonth+currentDay;
	console.log('in ibtToStore function date-->',date ,'orderNo-->',orderNo,'site:-->',site);

	inputStr="<?xml version='1.0' encoding='utf-8' standalone='yes'?>" +
			" <atom:entry xml:lang='en'  xmlns:atom='http://www.w3.org/2005/Atom' " +
			"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' " +
			"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' " +
			"xmlns:sap='http://www.sap.com/Protocols/SAPData' " +
			"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_TO_STORE_ORDER/'>" +
			" <atom:content type='application/xml'>" +
			" <m:properties>" +
			" <d:iv_date>"+date+"</d:iv_date>" +
			" <d:iv_order_no>"+orderNo+"</d:iv_order_no> " +
			"<d:iv_site>"+site+"</d:iv_site> " +
			"</m:properties> " +
			"</atom:content>" +
			" </atom:entry>";
	var requestXML=inputStr;
	console.log(requestXML);
	getIbtToStoreToken(requestXML);
}

function getIbtToStoreToken(inputStr){
	console.log('Getting token -  getPreqToken');
	var getIbtToStoreTokenUri = directUriPrefix+"ZSP_IBT_TO_STORE_ORDER/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getIbtToStoreTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : getIbtToStoreTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getIbtToStoreTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			ibtToStore(header_xcsrf_token, inputStr);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}

function ibtToStore(header_xcsrf_token, inputStr){
	console.log(inputStr);
	var ibtToStoreUri=directUriPrefix+"ZSP_IBT_TO_STORE_ORDER/zsp_ibt_to_store_orderCollection";
	$.ajax({
		url: ibtToStoreUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputStr,
		contentType: "application/atom+xml",
		success:  function (data, response){
			console.log("Success! ");
			console.log('response :', response);
			console.log('data :', data);
			console.log(data.results);
				var msg=$(data).find("IV_MSG").text();
				if(msg==''){
					console.log("Success",msg);
					localStorage['ibtToStoreFlag']="true";
					var stockAdjustedFlag=false;
					$('.levelThree').each(function(){
						var element=$(this);
						var adjustedQuantity=element.find('.adjustedValue').val();
						if(adjustedQuantity.trim().length>0){
							stockAdjustedFlag=true;
						}
					});
					console.log('stockAdjustedFlag : ', stockAdjustedFlag);
					if(stockAdjustedFlag){
						doIBTStockTransferInput();
					}else{
						if(localStorage['RO_tempCheckFlag']=='true'){
							grTempUpdateToken();
						}else{
							$('.loader').fadeOut();
							$('#one-button-popup .head-title').text('Success');
							$('#one-button-popup #popup-msg').text('IBT Received successfully');
							$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
							$('.overlay, #one-button-popup').fadeIn();
							centerAlign('#one-button-popup');
						}
					}
				}else{
					console.log(err);
					$('.loader').fadeOut();
					$('#one-button-popup .head-title').text('Error');
					$('#one-button-popup #popup-msg').text('IBT to Store Failed');
					$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
					$('.overlay, #one-button-popup').fadeIn();
					centerAlign('#one-button-popup');
				}

			},
		error:  function(err) {
			console.log(err);
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	});
}

function doIBTStockTransferInput(){
	var currentDate=new Date();
	var currentYear=currentDate.getFullYear();
	var currentMonth=('0' + (currentDate.getMonth()+1)).slice(-2);
	var currentDay=('0' + currentDate.getDate()).slice(-2);
	var today=currentYear+currentMonth+currentDay;
	var header='<?xml version="1.0" encoding="utf-8"?>\n'
		    	+'<atom:entry xmlns:atom="http://www.w3.org/2005/Atom"\n'
		    	+'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n'
		    	+'xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata"\n'
		    	+'xmlns:sap="http://www.sap.com/Protocols/SAPData"\n'
		    	+'xml:base="http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_IBT_ORDER_ADJ/">\n'
		    	+'<atom:content type="application/xml">\n'
		    	+'<m:properties>\n'
		    	+'<d:IV_ORDER_NO>'+localStorage["orderNo"]+'</d:IV_ORDER_NO>\n'
		    	+'<d:IV_SITE>'+localStorage["site"]+'</d:IV_SITE>\n'
		    	+'<d:IV_DATE>'+today+'</d:IV_DATE>\n'
		    	+'</m:properties>\n'
		    	+'</atom:content>\n'
		    	+'<atom:link rel="http://schemas.microsoft.com/ado/2007/08/dataservices/related/IBTItems"\n'
		    	+'type="application/atom+xml;type=feed"\n'
		    	+'title="ZSP_IBT_ORDER_ADJ.IBTHeader_IBTItems">\n'
		    	+'<m:inline>\n'
		    	+'<atom:feed>';
	var footer='</atom:feed>'
				+'</m:inline>\n'
				+'</atom:link>\n'
				+'</atom:entry>';
	var body='';
	$('.levelThree').each(function(i){
		var element=$(this);
		var article=element.find(".articleNo").text();
		var itemNo=element.find('.receivedItemNo').val();
		var adjustedQuantity=element.find('.adjustedValue').val();
		var movementType=element.find('.movementType').val();
		if(adjustedQuantity.trim().length>0){
			body =body+'<atom:entry>\n'
			          +'<atom:content type="application/xml">\n'
			          +'<m:properties>\n'
			          +'<d:IV_ORDER_NO>'+localStorage["orderNo"]+'</d:IV_ORDER_NO>\n'
			          +'<d:IV_ITEM_NO>'+itemNo+'</d:IV_ITEM_NO>\n'
			          +'<d:IV_ARTICLE>'+article+'</d:IV_ARTICLE>\n'
			          +'<d:IV_ADJUSTED_QTY>'+adjustedQuantity+'</d:IV_ADJUSTED_QTY>\n'
			          +'<d:IV_MVT_TYPE>'+movementType+'</d:IV_MVT_TYPE>\n'
			          +'<d:IV_RECV_STORE>'+site+'</d:IV_RECV_STORE>\n'
			          +'</m:properties>\n'
			          +'</atom:content>\n'
			          +'</atom:entry>';
		}
	});
	inputStr =header+body+footer;
	receiveOrderTokenUri =directUriPrefix+"ZSP_IBT_ORDER_ADJ";
	receiveOrderUri = directUriPrefix+"ZSP_IBT_ORDER_ADJ/IBTHeaders";
	console.log(inputStr);
	getIBTStockTransferToken(inputStr, receiveOrderTokenUri, receiveOrderUri);
}

function getIBTStockTransferToken(inputStr,receiveOrderTokenUri,receiveOrderUri){
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var getReceiveOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : receiveOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(getReceiveOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			doIBTStockTransfer(header_xcsrf_token, inputStr,receiveOrderUri);
		},function(err) {
			console.log("Error! No response received.");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	);
}

function doIBTStockTransfer(header_xcsrf_token, inputData ,receiveOrderUri){
	$('.loader').fadeIn();
	console.log('In receiveOrder : ', header_xcsrf_token, inputData);
	$.ajax({
		url: receiveOrderUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputData,
		contentType: "application/atom+xml",
		success :function (data, response){
			if($(data).find("IV_MSG").text() == ""){
				if(localStorage['RO_tempCheckFlag']=='true'){
					grTempUpdateToken();
				}else{
					delete localStorage['invoiceNo'];
					delete localStorage['invoiceTotal'];
					delete localStorage['gst'];
					delete localStorage['docketNumber'];
					localStorage['receivedInvoice']="false";
					localStorage['fromAdvSearchPage']='false';
					localStorage['firstTimeSearch']='true';
					localStorage['successReceive']='true';
					$('.loader').fadeOut();
					$('#one-button-popup .head-title').text('Success');
					$('#one-button-popup #popup-msg').text('IBT Received successfully');
					$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
					$('.overlay, #one-button-popup').fadeIn();
					centerAlign('#one-button-popup');
				}
			}
			else{
				$('.overlay,.loader').fadeOut();
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				$('#one-button-popup #popup-msg').text('IBT Receive Failed');
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}
		},
		error :function(err) {
			$('.loader').fadeOut();
			$('#cancel-order-status .head-title').text('Error');
			$('#cancel-order-status #popup-msg').text('Server not responding');
			$('.overlay, #cancel-order-status').fadeIn();
			centerAlign('#cancel-order-status');
			console.log("Error! No response received.", err.message);
		}
	});
}

function redirectFlow(orderType){
	//ibtSendNowOk();
	localStorage['TC_orderType']=orderType;
	if(orderType=='ibt'){
		localStorage['orderNo']=$('#ibt-success-popup .ibt-no').text();
		localStorage['orderType']='ZUB';
	}else{
		localStorage['orderNo']=$('#cor-step2-popup #order-no').text();
		localStorage['orderType']='ZNB';
	}
	$('.overlay, .loader').fadeIn();
	checkTemperature();
}

function addArticleToOrder(articleNumber, desc, om, baseQty, itemNumber){
	var orderNo=localStorage['orderNo'];
	//data=JSON.parse(data);
	/*var articleNumber = data.results[0].article.replace(/^0+/, '');
	var desc=data.results[0].description;
	var om=data.results[0].ord_mul;
	var baseQty= data.results[0].base_uom;*/
	var quantity=localStorage['AA_Quantity'];
	/*if(baseQty.toUpperCase()=='EA'){
		quantity=~~quantity;
		om=~~om;
	}*/
	baseQty='CAR';
	//var itemNumber='';
	var deliveryDate=localStorage['AA_DeliveryDate'];
	var supplierName=localStorage['searchSupplier_addArticle'];
	var supplierNumber=localStorage['searchSupplierName_addArticle'];
	var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = day + "." + month + "." + year;
	var addedFlag='added';
	if(localStorage['AA_type']=='Preq' || localStorage['AA_type']=='IBT'){
		if(wool.tableExists("OrderArticleTable")){
			if(wool.query("OrderArticleTable",{ArticleNo : articleNumber}).length==0){
				wool.insert('OrderArticleTable', {
					ArticleNo: articleNumber,
					Quantity: localStorage['AA_Quantity'],
					EditableField: deliveryDate, 
					ButtonState: 'save'
				});
				wool.commit();
			}
		}
	}else{
		if(wool.tableExists("OrderArticleTable")){
			if(wool.query("OrderArticleTable",{ArticleNo : articleNumber}).length==0){
				wool.insert('OrderArticleTable', {
					ArticleNo: articleNumber,
					Quantity: localStorage['AA_Quantity'],
					EditableField: om, 
					ButtonState: 'edit'
				});
				wool.commit();
			}
		}
	}
	if(localStorage['AA_addedDeletedDOM'].length>0){
		if(localStorage['AA_addedDeletedDOM'].split(' || ').length>1){
			for(var n=0; n<=localStorage['AA_addedDeletedDOM'].split(' || ').length-1; n++){
				var temp=" || "+localStorage['AA_addedDeletedDOM'].split(' || ')[n];
				if(n==0){
					temp=localStorage['AA_addedDeletedDOM'].split(' || ')[n];
				}
				if(localStorage['AA_addedDeletedDOM'].split(' || ')[n].indexOf(articleNumber)!=-1){
					if(localStorage['AA_addedDom'].length==0){
						localStorage['AA_addedDom']=localStorage['AA_addedDeletedDOM'].split(' || ')[n];
					}else{
						localStorage['AA_addedDom']=localStorage['AA_addedDom']+" || "+localStorage['AA_addedDeletedDOM'].split(' || ')[n];
					}
					var tempToo=localStorage['AA_addedDeletedDOM'].replace(temp, '');
					localStorage['AA_addedDeletedDOM']=tempToo;
				}
			}
		}else if(localStorage['AA_addedDom'].split(' || ').length==1){
			if(localStorage['AA_addedDom'].length==0){
				localStorage['AA_addedDom']=localStorage['AA_addedDeletedDOM'];
			}else{
				localStorage['AA_addedDom']=localStorage['AA_addedDom']+" || "+localStorage['AA_addedDeletedDOM'];
			}
			localStorage['AA_addedDeletedDOM']='';
		}
	}
	if(wool.tableExists("DeletedArticleTable")){
		if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length>0){
			wool.deleteRows('DeletedArticleTable', {ArticleNo: articleNumber});
			wool.commit();
			if(localStorage['AA_type']=='Preq' || localStorage['AA_type']=='IBT'){
				localStorage['pageId']='listOfArticles';
				window.location='listOfArticles.html';
			}else{
				localStorage['pageId']='receiveOrder';
		 		window.location='receiveOrder.html';
			}
		}else{
			console.log('In addArticleToOrder : ', orderNo, articleNumber, desc, om, baseQty, supplierName, supplierNumber, itemNumber, quantity ,deliveryDate);
			var totalOrdered=parseInt(quantity)*parseInt(om);
			deliveryDate=deliveryDate.split('.')[2]+"-"+deliveryDate.split('.')[1]+"-"+deliveryDate.split('.')[0];
			rosterDate=today;
			if(localStorage['AA_type']=='Preq'){
				var orderArticleItem='<div class="margin-top10 details-section borderRad4 font14 levelThree '+addedFlag+'">'
					+'<div class="width100 art-section">'
					+'<div class="width48 inlineBlock margin-left15 dark-green normal"><label>Article #</label>'
					+'<span class="articleNumber">'+articleNumber+'</span>'
					+'</div>'
					+'<div class="text-left margin-left15 margin-top5 dark-green bold">'
					+'<span class="description green">'+desc+'</span>'
					+'</div>'
					+'</div>'
					+'<div class="qty-section width100">'
					+'<div class="width30 inlineBlock margin-left15"><div class="margin-top10 gray-text">Order Qty.</div><div class="boxDisp boxAlign width48 item-val looupFont normalN"><input disabled class="edit-fields width50px search-field editQrdQty orderListTxt" type="text" value="0" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></div></div>'
					+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Order Multiple</div><div class="margin-top5 margin-bottom10 margin-left15 om">'+om+'</div></div>'
					+'<div class="width30 inlineBlock  border-left-gray"><div class="margin-top10 margin-left15 gray-text">Total Ordered</div><div class="margin-top5 margin-bottom10 margin-left15">'+totalOrdered+' &nbsp;<span class="uom">'+baseQty+'</span></div></div>'
					+'</div>'	
					+'<div class="qty-section width100">'
					+'<div class="height40 padding10 boxDisp border-bottom-gray"><div class="padding10  boxDisp boxAlign width50 text-align-left">Roster Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normal" >'+rosterDate+'</div></div>'
					+'<div class="height40 boxDisp border-bottom-gray"><div class="padding10  boxDisp boxAlign text-align-left width50">Delivery Date :&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" ><input value="'+deliveryDate+'" disabled class="editDelDate search-field  edit-fields orderListTxt date-field" type="date" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ></div></div>'
					+'</div>'
					+'<div class="width100 more-section action-btn-div page-bg ">'
					+'<div class="margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal"></div>'
					+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delete-btn" ></div>'
					+'<div class="inlineBlock float-right"><img src="../images/editButton.png"  alt="div-bar" class="edit-save action-btn" ></div>'
					+'</div><input  class="articleItemNo" type="hidden" value="'+itemNumber+'">'				
					+'</div>';
				localStorage['AA_addedDom']	=  localStorage['AA_addedDom']+" || "+orderArticleItem;
				localStorage['AA_itemAddedFlag']=articleNumber;
				localStorage['pageId']='listOfArticles';
				window.location='listOfArticles.html';
			}else if(localStorage['AA_type']=='Order'){
				console.log('In else if order');
		         var orderArticleItem = '<div id="srch-rslt-list" class="levelThree added details-section srch-rslt-list borderRad4 margin-top10 font14">'
		             +'<div class="width100 art-section">'
		             +'<div class="width48 inlineBlock margin-left15 green normal">'
		             +'<label>Article #</label>'
		             +'<span class="articleNo">'+articleNumber+'</span>'
		             +'<input  class="uom" type="hidden" value="'+baseQty+'">'
		             +'</div>'
		             +'<div class="width48 inlineBlock absolute rightZero grey marR5px txtRight">'
		             +'<div class="editSaveBtn deleteImgDiv editPr deletePosReceive">'
		             +'</div>'
		             +'<div class="editSaveBtn saveImgDiv editPr editPosReceive">'
		             +'</div>'
		             +'</div>'
		             +'<div class="text-left margin-left15 margin-top5 bold">'
		             +'<span class="description recvOrdDesc green">'+desc+'</span>'
		             +'<input type="hidden" class="receivedItemNo" value="'+itemNumber+'">'
		             +'</div>'
		             +'</div>'
		             +'<div class="qty-section width100">'
		             +'<div class="width33 inlineBlock txtLft">'
		             +'<div class="margin05 marL10px grey">Order Qty :</div>'
		             +'<div class="margin05 marL10px">'
		             +'<span class="ordered-qty">0</span>'
		             +'</div>'
		             +'</div>'
		             +'<div class="width33 inlineBlock  border-left-gray txtLft">'
		             +'<div class=" margin05 marL10px grey">Received Qty.</div>'
		             +'<div class="margin05 marL10px">'
		             +'<input type="number" value="'+quantity+'" class="rcvdQty received-qty editInputBorder editInputReceive editInputPack pad0 green editInput" >'
		             +'</div>'
		             +'</div>'
		             +'<div class="width33 inlineBlock  border-left-gray txtLft">'
		             +'<div class=" margin05 marL10px grey">Pack OM :</div>'
		             +'<div class="margin05 marL10px">'
		             +'<input type="number" value="'+om+'" class="packSize rcvdQty editInputBorder editInputReceive editInputPack pad0 green editInput">'
		             +'</div>'
		             +'</div>'
		             +'</div>'
		             +'</div>';
		         if(localStorage['AA_addedDom'].length>0){
					localStorage['AA_addedDom']	=  localStorage['AA_addedDom']+" || "+orderArticleItem;
				}else{
					localStorage['AA_addedDom']	= orderArticleItem;
				}
		 		localStorage['AA_itemAddedFlag']=articleNumber;
		 		localStorage['pageId']='receiveOrder';
		 		window.location='receiveOrder.html';
			}else if(localStorage['AA_type']=='IBT'){
				var orderArticleItem='<div id="order-artcle-item" class="levelThree added details-section borderRad4 margin-top10 marB10 font14">'
				+'<div class="width100 art-section">'
				+'<div class="width48 inlineBlock margin-left15 green normal">'
				+'<label>Article #</label>'
				+'<span class="articleNumber">'+articleNumber+'</span>'
				+'<input  class="articleItemNo" type="hidden" value="">'	
				+'</div>'
				+'<div class="width48 inlineBlock absolute rightZero grey marR5px txtRight">'
				+'<label>Vendor Ref #</label>'
				+'<span class="vendorNumber">'+localStorage['searchSupplier_addArticle']+'</span>'
				+'</div>'
				+'<div class="text-left margin-left15 margin-top5 bold">'
				+'<span class="description green">'+desc+'</span>'
				+'</div>'
				+'</div>'
				+'<div class="qty-section width100">'
				+'<div class="width33 inlineBlock txtLft">'
				+'<div class="margin05 marL10px grey">Order Qty.</div>'
				+'<div class="margin05 marL10px"><input class="edit-fields ibtedit width50px search-field editQrdQty orderListTxt" type="text" value="'+quantity+'" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" > <span class="cartons uom">'+baseQty+'</span></div>'
				+'</div>'
				+'<div class="width33 inlineBlock  border-left-gray txtLft">'
				+'<div class=" margin05 marL10px grey">Dispatch Qty.</div>'
				+'<div class="margin05 marL10px"><span class="dispatchQuantity">0.00</span> <span class="cartons">'+baseQty+'</span></div></div>'
				+'<div class="width33 inlineBlock  border-left-gray txtLft">'
				+'<div class=" margin05 marL10px grey">Received Qty.</div>'
				+'<div class="margin05 marL10px"><span class="receivedQuantity">0.00</span> <span class="cartons">'+baseQty+'</span></div>'
				+'</div>'
				+'</div>'
				+'<div class="inlineBlock float-right"><img src="../images/deleteButton.png" alt="div-bar" class="action-btn delete-btn" ></div>'
				+'<div class="inlineBlock float-right"><img src="../images/editButton.png"  alt="div-bar" class="edit-save action-btn" ></div>'
				+'<div class="width100 more-section page-bg">'
				+'<div class="list-moreToggle margin-bottom10 margin-top10 width48 inlineBlock margin-left15 dark-green normal" ><div class="inlineBlock"><img src="../images/LookUp_DownArrow.png" id="more-img" alt="div-bar" class="more-img" ></div><div class="inlineBlock absolute">more details</div></div>'
				+'<div id="more-details" class=" boxDisp boxOrient borderTop hide">'
				+'<div class = " boxDisp borderBottom " >'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Unsupplied Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="unsuppliedQty">'+om+'</div></div>'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">Allocated Qty:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="allocatedQty">'+om+'</div></div>'
				+'</div>'
				+'<div class = " boxDisp borderBottom " >'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SOH:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonHand">'+om+'</div></div>'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">SOO:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockonOrder">'+om+'</div></div>'
				+'</div>'
				+'<div class = " boxDisp borderBottom " >'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50  text-align-left">SIT:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="stockInTransist">'+om+'</div></div>'
				+'<div class="height30 width50 margin5 boxDisp"><div class="boxDisp boxAlign width50 text-align-left">OM:&nbsp;</div><div class="boxDisp boxAlign width48 item-val looupFont normalN" id="orderMultiple">'+om+'</div></div>'
				+'</div>'
				+'</div>'
				+'</div>'
				+'</div>';
			if(localStorage['AA_addedDom'].length>0){
				localStorage['AA_addedDom']	=  localStorage['AA_addedDom']+" || "+orderArticleItem;
			}else{
				localStorage['AA_addedDom']	= orderArticleItem;
			}
			localStorage['AA_itemAddedFlag']=articleNumber;
			localStorage['pageId']='listOfArticles';
			window.location='listOfArticles.html';
			}
		}
	}
}
function removeArticleFromOrder(articleNumber){
	$.each($(".levelThree"), function () {
		if($(this).find('.articleNo').text()==articleNumber){
			$(this).addClass('deleted').hide();
		}
	});
	console.log('removeArticleFromOrder');
	if(wool.tableExists("OrderArticleTable")){
		wool.deleteRows('OrderArticleTable', {ArticleNo: articleNumber});
		wool.commit();
	}
	if(wool.tableExists("DeletedArticleTable")){
		if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length==0){
			wool.insert('DeletedArticleTable', {ArticleNo: articleNumber});
			wool.commit();
		}
	}
	if(localStorage['AA_addedDom'].split(' || ').length>1){
		console.log(articleNumber);
		for(var n=0; n<=localStorage['AA_addedDom'].split(' || ').length-1; n++){
			if(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber)!=-1){
				console.log(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber));
				var temp=" || "+localStorage['AA_addedDom'].split(' || ')[n];
				if(n==0){
					temp=localStorage['AA_addedDom'].split(' || ')[n];
				}
				console.log(temp);
				if(localStorage['AA_addedDeletedDOM'].length==0){
					localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'].split(' || ')[n];
				}else{
					if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
						localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'].split(' || ')[n];	
					}
				}
				var tempToo=localStorage['AA_addedDom'].replace(temp, '');
				localStorage['AA_addedDom']=tempToo;
			}
		}
	}else if(localStorage['AA_addedDom'].split(' || ').length==1){
		if(localStorage['AA_addedDom'].indexOf(articleNumber)!=-1){
			if(localStorage['AA_addedDeletedDOM'].length==0){
				localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'];
			}else{
				if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
					localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'];
				}
			}
			localStorage['AA_addedDom']='';
		}
	}
	console.log(wool.query('OrderArticleTable'));
	$('#two-button-popup, .overlay').fadeOut();
}
function updateOrderItems(){
	console.log('In updateOrderItems');
	var header="<?xml version='1.0' encoding='utf-8'?>\n"
		+"<atom:entry xmlns:atom='http://www.w3.org/2005/Atom' \n"
		+"xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' \n"
		+"xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata'\n"
		+"xmlns:sap='http://www.sap.com/Protocols/SAPData' \n"
		+"xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_PO_APPEND'>\n"
		+"<atom:content type='application/xml'>\n"
		+"<m:properties>\n"
		+"<d:IV_ORDER_NO>"+localStorage["orderNo"]+"</d:IV_ORDER_NO>\n"
		+"<d:IV_SITE>"+localStorage["site"]+"</d:IV_SITE>\n"
		+"</m:properties></atom:content>\n"
		+"<atom:link rel='http://schemas.microsoft.com/ado/2007/08/dataservices/related/POItems'\n"
		+"type='application/atom xml;type=feed' \n"
		+"title='ZSP_PO_APPEND.POHeader_POItem'>\n"
		+"<m:inline>\n"
		+"<atom:feed>\n";

		var footer="</atom:feed>\n"
		+"</m:inline>\n"
		+"</atom:link>\n"
		+"</atom:entry>\n";
		var articleDetails='';
		
		if(localStorage['orderType']=='ZUB'){
			$('.overlay, .loader').fadeIn();
			$.each($(".levelThree"), function () {
				var flag='U';
				if($(this).hasClass('deleted') &&  $(this).hasClass('added')){
					flag='skip';
				}else if($(this).hasClass('added')){
					flag='I';
				}else if($(this).hasClass('deleted')){
					flag='D';
				}
				console.log(flag);
				var articleNumber=$(this).find('.articleNumber').text();
				var itemNumber=$(this).find('.articleItemNo').val();
				console.log(itemNumber);
				var quantity=$(this).find('.editQrdQty').val();
				var uom=$(this).find('.uom').text();
				var deliveryDate=localStorage['AA_DeliveryDate'].split('.')[2]+localStorage['AA_DeliveryDate'].split('.')[1]+localStorage['AA_DeliveryDate'].split('.')[0];
				if(flag!='skip'){
					articleDetails=articleDetails+"<atom:entry>\n"
						+"<atom:content type='application/xml'>\n"
						+"<m:properties>\n"
						+"<d:IV_ORDER_NO>"+localStorage["orderNo"]+"</d:IV_ORDER_NO>\n"
						+"<d:IV_ITEM_NO>"+itemNumber+"</d:IV_ITEM_NO>\n"
						+"<d:IV_ARTICLE>"+articleNumber+"</d:IV_ARTICLE>\n"
						+"<d:IV_QTY>"+quantity+"</d:IV_QTY>\n"
						+"<d:IV_FLAG>"+flag+"</d:IV_FLAG>\n"
						+"<d:IV_UOM>"+uom+"</d:IV_UOM>\n"
						+"<d:IV_SITE>"+localStorage['IBTAA_receivingStore'].split(' | ')[0].replace(/^0+/, '')+"</d:IV_SITE>\n"
						+"<d:IV_DELV_DATE>"+deliveryDate+"</d:IV_DELV_DATE>\n"
						+"</m:properties>\n"
						+"</atom:content>\n"
						+"</atom:entry> \n";
				}
			});
		}else{
			$.each($(".levelThree"), function () {
				var quantity=$(this).find('.ordered-qty').text();
				var flag='U';
				if($(this).hasClass('deleted') &&  $(this).hasClass('added')){
					flag='skip';
				}else if($(this).hasClass('added')){
					flag='I';
					quantity=$(this).find('.received-qty').val();
				}else if($(this).hasClass('deleted')){
					flag='D';
				}
				console.log(flag);
				var articleNumber=$(this).find('.articleNo').text();
				var itemNumber=$(this).find('.receivedItemNo').val();
				var uom=$(this).find('.uom').val();
				uom='CAR';
				var deliveryDate=localStorage['AA_DeliveryDate'].split('.')[2]+localStorage['AA_DeliveryDate'].split('.')[1]+localStorage['AA_DeliveryDate'].split('.')[0];
				if(flag!='skip'){
					articleDetails=articleDetails+"<atom:entry>\n"
						+"<atom:content type='application/xml'>\n"
						+"<m:properties>\n"
						+"<d:IV_ORDER_NO>"+localStorage["orderNo"]+"</d:IV_ORDER_NO>\n"
						+"<d:IV_ITEM_NO>"+itemNumber+"</d:IV_ITEM_NO>\n"
						+"<d:IV_ARTICLE>"+articleNumber+"</d:IV_ARTICLE>\n"
						+"<d:IV_QTY>"+quantity+"</d:IV_QTY>\n"
						+"<d:IV_FLAG>"+flag+"</d:IV_FLAG>\n"
						+"<d:IV_UOM>"+uom+"</d:IV_UOM>\n"
						+"<d:IV_SITE>"+localStorage["site"]+"</d:IV_SITE>\n"
						+"<d:IV_DELV_DATE>"+deliveryDate+"</d:IV_DELV_DATE>\n"
						+"</m:properties>\n"
						+"</atom:content>\n"
						+"</atom:entry> \n";
				}
			});
		}
		
	var inputStr=header+articleDetails+footer;
	console.log('Input : ', inputStr);
	getAppendOrderToken(inputStr);
}

function getAppendOrderToken(inputStr){
	console.log('In getAppendOrderToken');
	var appendOrderTokenUri=directUriPrefix+"ZSP_PO_APPEND/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var appendOrderTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : appendOrderTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(appendOrderTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			appendOrder(header_xcsrf_token, inputStr);
		},function(err) {
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	); 
}

function appendOrder(header_xcsrf_token, inputStr){
	console.log('In appendOrder');
	var appendOrderri=directUriPrefix+"ZSP_PO_APPEND/POHeaders";
	oHeaders['X-CSRF-Token'] = header_xcsrf_token;
	oHeaders['Accept'] = 'application/atom+xml';
	oHeaders['DataServiceVersion'] = '2.0';
	console.log("Header fields : ", oHeaders);
	$.ajax({
		url: appendOrderri,
		type: 'POST',

		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:inputStr,
		contentType: "application/atom+xml",
		success:  function (data, response){
			if($(data).find('IV_MSG').text().length==0){
				console.log("success");
				if(localStorage['orderType']=='ZUB'){
					$('.loader').fadeOut();
					$('#one-button-popup .head-title').text('Success');
					$('#one-button-popup #popup-msg').text('IBT Updated successfully');
					$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
					$('.overlay, #one-button-popup').fadeIn();
					centerAlign('#one-button-popup');
				}else{
					finalizeOrderReceipt();
				}
			}else{
				if(localStorage['orderType']=='ZUB'){
					$('#one-button-popup #popup-msg').text('IBT Update Failed. SAP Error - '+$(data).find('IV_MSG').text());	
				}else{
					$('#one-button-popup #popup-msg').text('PO Append Failed. SAP Error - '+$(data).find('IV_MSG').text());
				}
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}
			
		},
		error:  function(err) {
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	
	});
}

function showVendorAuthorization(){
	$('#vendor-claim-popup, .overlay').fadeIn();
	centerAlign('#vendor-claim-popup');
}

function editAuthorisationNumberToken(){
	$('#vendor-claim-popup').fadeOut();
	var vendorClaimNumber=$('#vendor-claim-popup .authorisation-number').val();
	if(vendorClaimNumber.trim().length==0){
		$('#one-button-popup .head-title').text('Error');
		$('#one-button-popup #popup-msg').text('Please enter valid vendor authorisation number');
		$('#one-button-popup #OK').attr('onclick',"$('#one-button-popup').fadeOut();showVendorAuthorization();");
		$('.overlay, #one-button-popup').fadeIn();
		centerAlign('#one-button-popup');
	}else{
		$('.loader').fadeIn();
		var vendorClaimInput="<?xml version='1.0' encoding='utf-8' standalone='yes'?>\n"
			+"<atom:entry xml:lang='en'  xmlns:atom='http://www.w3.org/2005/Atom' xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' xmlns:sap='http://www.sap.com/Protocols/SAPData' xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_VENDOR_CLAIM_SERVICE'> \n"
			+"<atom:content type='application/xml'>\n"
			+"<m:properties>\n"
			+"<d:IV_PO_NO>"+localStorage['orderNo']+"</d:IV_PO_NO> \n"
			+"<d:IV_VCAN>"+vendorClaimNumber+"</d:IV_VCAN> \n"
			+"<d:IV_SITE></d:IV_SITE> \n"
			+"</m:properties> \n"
			+"</atom:content> \n"
			+"</atom:entry>";
		console.log(vendorClaimInput);
		var vendorClaimTokenUri = directUriPrefix+"ZSP_VENDOR_CLAIM_SERVICE/";
		var oHeaders = {};
		oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
		oHeaders['Accept'] = "application/json";
		oHeaders['X-CSRF-Token'] = "fetch";
		var vendorClaimTokenHeader = {
			headers : oHeaders, // object that contains HTTP headers as name value pairs
			requestUri : vendorClaimTokenUri, // OData endpoint URI
			method : "GET"
		};
		OData.request(vendorClaimTokenHeader,
			function (data, response){
				var header_xcsrf_token = response.headers['x-csrf-token'];
				console.log("Token : ",header_xcsrf_token);
				editAuthorisationNumber(header_xcsrf_token, vendorClaimInput);
			},function(err) {
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Error');
				$('#one-button-popup #popup-msg').text('Server not responding');
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
			}
		);
	}
}

function editAuthorisationNumber(header_xcsrf_token, vendorClaimInput){
	var vendorClaimUri=directUriPrefix+"ZSP_VENDOR_CLAIM_SERVICE/VCAN";
	$.ajax({
		url: vendorClaimUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:vendorClaimInput,
		contentType: "application/atom+xml",
		success:function(data,response){
			console.log("success");
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Success');
			$('#one-button-popup #popup-msg').text('Vendor authorisation Number saved Successfully');
			if(localStorage['pageId']=='orderDetail')
				$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='orderDetail';window.location='orderDetail.html';");
			else
				$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		},
	   error :function(err){
		   $('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
			console.log("Error! No response received.", err.message);
	   }
	});
}

function grTempUpdateToken(){
	$('.loader').fadeIn();
	var grTemp=localStorage['GR_Temperature'];
	console.log('GR_temperature: ', localStorage['GR_Temperature']);
	var grTempInput="<?xml version='1.0' encoding='utf-8' standalone='yes'?> \n"
		+"<atom:entry xml:lang='en'  xmlns:atom='http://www.w3.org/2005/Atom' xmlns:d='http://schemas.microsoft.com/ado/2007/08/dataservices' xmlns:m='http://schemas.microsoft.com/ado/2007/08/dataservices/metadata' xmlns:sap='http://www.sap.com/Protocols/SAPData' xml:base='http://clsapa320.woolworths.com.au:8021/sap/opu/odata/sap/ZSP_GRTEMP_UPDATE'> \n"
		+"<atom:content type='application/xml'> \n"
		+"<m:properties> \n"
		+"<d:IV_PO_NO>"+localStorage['orderNo']+"</d:IV_PO_NO>\n" 
		+"<d:IV_GRTEMP1>"+grTemp+"</d:IV_GRTEMP1> \n"
		+"</m:properties> \n"
		+"</atom:content> \n"
		+"</atom:entry>";
	console.log(grTempInput);
	var grTempUpdateTokenUri = directUriPrefix+"ZSP_GRTEMP_UPDATE/";
	var oHeaders = {};
	oHeaders['Authorization'] = "Basic "+ btoa(strUsername + ":" + strPassword);
	oHeaders['Accept'] = "application/json";
	oHeaders['X-CSRF-Token'] = "fetch";
	var grTempUpdateTokenHeader = {
		headers : oHeaders, // object that contains HTTP headers as name value pairs
		requestUri : grTempUpdateTokenUri, // OData endpoint URI
		method : "GET"
	};
	OData.request(grTempUpdateTokenHeader,
		function (data, response){
			var header_xcsrf_token = response.headers['x-csrf-token'];
			console.log("Token : ",header_xcsrf_token);
			grTempUpdate(header_xcsrf_token, grTempInput);
		},function(err) {
			$('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
		}
	); 
}

function grTempUpdate(header_xcsrf_token, grTempInput){
	var grTempUpdateUri=directUriPrefix+"ZSP_GRTEMP_UPDATE/GR_TEMP";
	$.ajax({
		url: grTempUpdateUri,
		type: 'POST',
		beforeSend: function(xhr) { 
			xhr.setRequestHeader('Authorization', '"Basic "+'+ btoa(strUsername+'":"'+ strPassword));
			xhr.setRequestHeader('X-CSRF-Token', header_xcsrf_token);	
		},
		dataType: "xml",
		data:grTempInput,
		contentType: "application/atom+xml",
		success:function(data,response){
			console.log("success");
			$('.loader').fadeOut();
			if (localStorage['orderType'] == "ZUB") {
				delete localStorage['invoiceNo'];
				delete localStorage['invoiceTotal'];
				delete localStorage['gst'];
				delete localStorage['docketNumber'];
				localStorage['receivedInvoice']="false";
				localStorage['fromAdvSearchPage']='false';
				localStorage['firstTimeSearch']='true';
				localStorage['successReceive']='true';
				$('.loader').fadeOut();
				$('#one-button-popup .head-title').text('Success');
				$('#one-button-popup #popup-msg').text('IBT Received successfully');
				$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
				$('.overlay, #one-button-popup').fadeIn();
				centerAlign('#one-button-popup');
		    }else {
				var receivedInvoiceFlag= localStorage['receivedInvoice'];
				if(receivedInvoiceFlag == "true"){
					delete localStorage['invoiceNo'];
					delete localStorage['invoiceTotal'];
					delete localStorage['gst'];
					delete localStorage['docketNumber'];
					localStorage['receivedInvoice']="false";
					localStorage['fromAdvSearchPage']='false';
					localStorage['firstTimeSearch']='true';
					localStorage['successReceive']='true';
					$('.loader').fadeOut();
					$('#one-button-popup .head-title').text('Success');
					$('#one-button-popup #popup-msg').text('Order Received successfully');
					$('#one-button-popup #OK').attr('onclick',"localStorage['pageId']='viewOrder';window.location='viewOrder.html';");
					$('.overlay, #one-button-popup').fadeIn();
					centerAlign('#one-button-popup');
					
				}
				else{
					$('.loader').fadeOut();
					$('#one-button-popup .head-title').text('Error');
					$('#one-button-popup #popup-msg').text('Server not responding');
					$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
					$('.overlay, #one-button-popup').fadeIn();
					centerAlign('#one-button-popup');
				}
			}
		},
	   error :function(err){
		   $('.loader').fadeOut();
			$('#one-button-popup .head-title').text('Error');
			$('#one-button-popup #popup-msg').text('Server not responding');
			$('#one-button-popup #OK').attr('onclick',"$('.overlay, #one-button-popup').fadeOut();");
			$('.overlay, #one-button-popup').fadeIn();
			centerAlign('#one-button-popup');
			console.log("Error! No response received.", err.message);
	   }
	});
}

function deleteArticleFromPreqList(){
	var articleNumber=$('#delete-popup .articleNo').text();
	 console.log('removeArticleFromOrder');
		if(wool.tableExists("OrderArticleTable")){
			wool.deleteRows('OrderArticleTable', {ArticleNo: articleNumber});
			wool.commit();
		}
		$('.levelThree').each(function(i){
			if($(this).find('.articleNumber ').text()==articleNumber){
				$(this).addClass('deleted').hide();
			}
		});
		 
		if(wool.tableExists("DeletedArticleTable")){
			if(wool.query("DeletedArticleTable",{ArticleNo : articleNumber}).length==0){
				wool.insert('DeletedArticleTable', {ArticleNo: articleNumber});
				wool.commit();
			}
		}
		if(localStorage['AA_addedDom'].split(' || ').length>1){
			console.log(articleNumber);
			for(var n=0; n<=localStorage['AA_addedDom'].split(' || ').length-1; n++){
				if(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber)!=-1){
					console.log(localStorage['AA_addedDom'].split(' || ')[n].indexOf(articleNumber));
					var temp=" || "+localStorage['AA_addedDom'].split(' || ')[n];
					if(n==0){
						temp=localStorage['AA_addedDom'].split(' || ')[n];
					}
					console.log(temp);
					if(localStorage['AA_addedDeletedDOM'].length==0){
						localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'].split(' || ')[n];
					}else{
						if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
							localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'].split(' || ')[n];	
						}
					}
					var tempToo=localStorage['AA_addedDom'].replace(temp, '');
					localStorage['AA_addedDom']=tempToo;
				}
			}
		}else if(localStorage['AA_addedDom'].split(' || ').length==1){
			if(localStorage['AA_addedDom'].indexOf(articleNumber)!=-1){
				if(localStorage['AA_addedDeletedDOM'].length==0){
					localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDom'];
				}else{
					if(localStorage['AA_addedDeletedDOM'].indexOf(articleNumber)==-1){
						localStorage['AA_addedDeletedDOM']=localStorage['AA_addedDeletedDOM']+" || "+localStorage['AA_addedDom'];
					}
				}
				localStorage['AA_addedDom']='';
			}
		}
		$('.articleCount').text(wool.query('OrderArticleTable').length);
		$('#delete-popup, .overlay').fadeOut();
}

/* ------ Ordering flow changed code -- Nivedhitha ------ */

function addToVendorTableValidation(){
	$('.overlay, .loader').fadeIn();
	var previousPage=localStorage['previousPage'];
	var buttonClicked=localStorage['buttonClicked'];
	console.log('In addToVendorTableValidation. Page : ', previousPage, 'Btn : ', buttonClicked);
	var articleSearchInput=$('#search-input').val();
	var typeOfInput='';
	var productLookupUri='';
	var isBarcodeScanned=$('.barcode-details').is(":visible");
	var barcodeArticle='';
	var supplierNo='';
	if(previousPage=='ibt'){
		supplierNo=localStorage['searchSupplier_ibt'];
		orderTypePrefix='CI';
		orderTypeSuffix='ibt';
	}else if(previousPage=='createOrder'){
		supplierNo=localStorage['searchSupplier_createOrder'];
		orderTypePrefix='CO';
		orderTypeSuffix='createOrder';
	}else if(previousPage=='createPreq'){
		supplierNo=localStorage['searchSupplier_createPreq'];
		orderTypePrefix='CP';
		orderTypeSuffix='createPreq';
	}else if(previousPage=='createOrderOnReceipt'){
		supplierNo=localStorage['searchSupplier_createOrderOnReceipt'];
		orderTypePrefix='COR';
		orderTypeSuffix='createOrderOnReceipt';
	}else if(previousPage=='addArticle'){
		supplierNo=localStorage['searchSupplier_addArticle'];
		orderTypePrefix='AA';
		orderTypeSuffix='addArticle';
		if(localStorage['orderType']=='ZY'){
			localStorage['AA_sos']='1';
		}else{
			localStorage['AA_sos']='2';
		}
	}
	if(previousPage!='addArticle'){
		localStorage[orderTypePrefix+'_sos']='1';
	}
	console.log(supplierNo, orderTypePrefix, orderTypeSuffix);
	var searchKey=articleSearchInput+" | "+supplierNo;
	if(isBarcodeScanned){
		barcodeArticle=$('#articleNumber').text();
		localStorage['barcodeDescription']=$('#description').text();
		localStorage['Order_SOH']=$('.stockOnHand').text();
		localStorage['Order_OM']=$('.quantityOM').text();
	}
	var supplierType=$("input:radio[name=supplierType]:checked").val();
	var ibtSupplierFlag=false;
	var supplier='';
	if(previousPage=='ibt'){
		if(supplierType=='warehouse'){
			supplier=$('#warehouse-list').val();
			if(supplier=='default'){
				ibtSupplierFlag=true;
			}
		}else if(supplierType=='store'){
			supplier=$('#store-input').val();
			if(supplier.trim().length==0){
				ibtSupplierFlag=true;
			}
		}
	}
	var supplierNumber='';
	var supplierName='';
	
	if(supplierType=='warehouse'){
		supplier=$('#warehouse-list').val();
		if(supplier!='default'){
			supplierNumber=supplier;
			supplierName=$("#warehouse-list option:selected").text().split(" | ")[0];
			localStorage[orderTypePrefix+'_sos']='2';
		}
	}else{
		if(previousPage=='createOrder' || previousPage=='createPreq' || previousPage=='createOrderOnReceipt' ){
			if(supplierType=='vendor'){
				localStorage[orderTypePrefix+'_sos']='1';
				if(previousPage!='addArticle'){
					supplier=$('#vendor-input').val();
				}
				
			}
		}else if(previousPage=='ibt'){
			if(supplierType=='store'){
				localStorage[orderTypePrefix+'_sos']='0';
				supplier=$('#store-input').val();
			}
		}
	}
	var quantity=$('.quantity').val();
	localStorage['Order_barcode']=isBarcodeScanned;
	localStorage['Order_description']=$('#description').text();
	localStorage['Order_article']=articleSearchInput;
	localStorage['Order_quantity']=quantity;
	localStorage['Order_supplierType']=supplierType;
	localStorage['Order_supplier']=supplier;
	if(buttonClicked=='search'){
		var isArticlePresent=0;
		var numberOfArticlesPresent=0;
		if(localStorage['previousPage']=='addArticle')
			numberOfArticlesPresent=1;
		else
			if($('.no-of-items').text()!='')
				numberOfArticlesPresent=$('.no-of-items').text();
		if ($.isNumeric(articleSearchInput)){
			console.log('Numeric');
			var tableName='OrderListTable';
			if(localStorage['previousPage']=='addArticle'){
		    	tableName='OrderArticleTable';
		    	if(wool.tableExists(tableName)){
					isArticlePresent=wool.query(tableName,{ArticleNo : articleSearchInput}).length;
				}
		    }else{
			    if(localStorage['previousPage']=='createPreq'){
			    	tableName='PreqListTable';
			    }else if(localStorage['previousPage']=='createOrderOnReceipt'){
			    	tableName='CORListTable';
			    }else if(localStorage['previousPage']=='ibt'){
			    	tableName='IBTListTable';
			    }
				if(wool.tableExists(tableName)){
					isArticlePresent=wool.query(tableName,{ItemNo : articleSearchInput}).length;
				}
		    }
		}
		if(articleSearchInput.trim().length==0){
			errorOkPopup("Please enter article or scan barcode","");
		}else if((articleSearchInput.trim().length>0 && barcodeArticle.length>0) && articleSearchInput!=barcodeArticle){
			errorOkPopup("Article conflict. Please choose either "+articleSearchInput+" or "+barcodeArticle,"");
		}else if(isArticlePresent>0){
			errorOkPopup("Article already present in list","");
		}else{
			var searchTermLength=articleSearchInput.length;
			if ($.isNumeric(articleSearchInput)){
				if(searchTermLength==4 || searchTermLength>6){
					if(searchTermLength==4){
						typeOfInput='plu';
					}else{
						typeOfInput='gtin';
					}
					if(numberOfArticlesPresent==0)
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+articleSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					else{
						if(previousPage=='ibt'){
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+supplierNo+"' and iv_gtin eq '"+articleSearchInput+"' and iv_ranged  eq 'X'";
						}else{
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+localStorage[orderTypePrefix+'_sos']+"' and iv_supplier eq '"+supplierNo+"' and iv_site eq '"+site+"' and iv_gtin eq '"+articleSearchInput+"' and iv_ranged  eq 'X'";
						}
					}
				}else{
					typeOfInput='article';
					if(numberOfArticlesPresent==0)
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+articleSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
					else{
						if(previousPage=='ibt'){
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+supplierNo+"' and iv_article eq '"+articleSearchInput+"' and iv_ranged  eq 'X'";
						}else{
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+localStorage[orderTypePrefix+'_sos']+"' and iv_supplier eq '"+supplierNo+"' and iv_site eq '"+site+"' and iv_article eq '"+articleSearchInput+"' and iv_ranged  eq 'X'";
						}
					}
				}
			}else{
				typeOfInput='description';
				if(numberOfArticlesPresent==0)
					productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_desc  eq '*"+encodeURIComponent(articleSearchInput)+"*' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
				else{
					if(previousPage=='ibt'){
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+supplierNo+"' and iv_desc eq '*"+encodeURIComponent(articleSearchInput)+"*' and iv_ranged  eq 'X'";
					}else{
						productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_sos eq '"+localStorage[orderTypePrefix+'_sos']+"' and iv_supplier eq '"+supplierNo+"' and iv_site eq '"+site+"' and iv_desc eq '*"+encodeURIComponent(articleSearchInput)+"*' and iv_ranged  eq 'X'";
					}
				}
			}
			localStorage['OPL_supplierCheckFlag']='false';
			orderProductLookup(searchKey, articleSearchInput, productLookupUri, previousPage, typeOfInput, buttonClicked);
		}
	}else if(buttonClicked=='add'){
		var uom=$('#articleInformation').val().split(' | ')[4];
		if(!isBarcodeScanned){
			errorOkPopup("Please select an article to continue", "");
		}else if(quantity.trim().length==0){
			errorOkPopup("Please enter quantity", ".quantity");
		}else if(quantity<=0){
			errorOkPopup("Quantity should not be zero or less than zero", ".quantity");
		}else if(quantity % 1 != 0 && uom.toUpperCase()!='KG'){
			errorOkPopup("Quantity should be a whole number", ".quantity");
		}else if(previousPage=='ibt' && (supplierType=='' || supplierType==undefined)){
			errorOkPopup("Please select IBT Site", "");
		}else if(previousPage=='ibt' && ibtSupplierFlag){
			errorOkPopup("Please select a "+supplierType,"");
		}else if(previousPage=='ibt' && supplierType=='store' && supplier==localStorage['site']){
			errorOkPopup("Home site cannot be receiving site","#store-input");
		}else{
			
			var currentDate = new Date();
			var date = new Date();
		    date.setDate(currentDate.getDate() + 1);
		    var day = date.getDate();
		    var month = date.getMonth() + 1;
		    var year = date.getFullYear();
		    if (month < 10) month = "0" + month;
		    if (day < 10) day = "0" + day;
		    var deliveryDate = year + "-" + month + "-" + day;
		    if(previousPage=='createOrder' && wool.tableExists("OrderListTable") && wool.query("OrderListTable").length>0){
		    	deliveryDate=wool.query("OrderListTable")[0].DeliveryDate;
			}
			if(previousPage=='ibt' && wool.tableExists("IBTListTable") && wool.query("IBTListTable").length>0){
				deliveryDate=wool.query("IBTListTable")[0].DeliveryDate;
			}
			if(previousPage=='createPreq' && wool.tableExists("PreqListTable") && wool.query("PreqListTable").length>0){
				deliveryDate=wool.query("PreqListTable")[0].DeliveryDate;
			}
			if(previousPage=='createOrderOnReceipt' && wool.tableExists("CORListTable") && wool.query("CORListTable").length>0){
				deliveryDate=wool.query("CORListTable")[0].DeliveryDate;
			}
		    if(previousPage!='addArticle')
				localStorage[orderTypePrefix+'_DeliveryDate']=deliveryDate;
			else
				localStorage[orderTypePrefix+'_DeliveryDate']=localStorage['AA_DeliveryDate'];
		    
		    localStorage[orderTypePrefix+'_Quantity']=quantity;		
			var searchArticle=$('#articleNumber').text();
			localStorage['supplierType_'+orderTypeSuffix]=supplierType;
			console.log('T : ', supplierType, ' No : ', supplierNumber, ' Name : ', supplierName);
			if((previousPage=='createOrder' || previousPage=='createPreq' || previousPage=='createOrderOnReceipt') && (supplierType!="vendor" || (supplierType=="vendor" && supplier.trim().length==0))){
				 localStorage['searchTerm_'+orderTypeSuffix] = searchArticle;
				 localStorage['searchSupplier_'+orderTypeSuffix] = supplierNumber;
				 localStorage['searchSupplierName_'+orderTypeSuffix] = supplierName;
				 console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
				 productSearch();
			}else if(previousPage=='ibt' && (supplierType!="store" || (supplierType=="store" && supplier.trim().length==0))){
					 localStorage['searchTerm_'+orderTypeSuffix] = searchArticle;
					 localStorage['searchSupplier_'+orderTypeSuffix] = supplierNumber;
					 localStorage['searchSupplierName_'+orderTypeSuffix] = supplierName;
					 console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
					 productSearch();
			}else if(previousPage=='addArticle'){
				localStorage['searchTerm_'+orderTypeSuffix] = searchArticle;
				console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
				productSearch();
			}else{
				var fromLookUpDetails=localStorage["fromLookUpDetails"];
				if($('.no-of-items').text()>=1 || fromLookUpDetails!=''){
					localStorage['searchTerm_'+orderTypeSuffix] = searchArticle;
					localStorage['searchSupplier_'+orderTypeSuffix] = supplier.split(" | ")[0];
					localStorage['searchSupplierName_'+orderTypeSuffix] =  supplier.split(" | ")[1];
					console.log("localStorage['previousPage'] : ", localStorage['previousPage']);
					productSearch();
				}else{
					localStorage['searchTerm_'+orderTypeSuffix] = searchArticle;
					if(previousPage=='createOrder' || previousPage=='createPreq' || previousPage=='createOrderOnReceipt'){
						getSupplier(supplier, searchArticle);
					}else{
						getStore(supplier, searchArticle);
					}
				}
			}
		}
	}
}

function orderProductLookup(searchKey, articleSearchInput, productLookupUri, previousPage, typeOfInput, buttonClicked){
	var isPresent=false;
	if(typeOfInput=='description'){
		if (!wool.tableExists("ArticleSearchResults")) {
	    	console.log('articleSearchResults table does not exist');
	        wool.createTable("ArticleSearchResults", ['SearchKey', 'SearchTerm', 'ItemNo', 'Description', 'Soh', 'Om', 'BaseQty', 'UnitPrice', 'Sos', 'VendorNo', 'VendorName', 'PurchasePrice', 'Department']);
	        console.log('articleSearchResults Table created');           
	    }
		isPresent=findOrderSearchTerm(searchKey);
	}
	console.log('In orderProductLookup. productLookupUri : ', productLookupUri, ' buttonClicked : ', buttonClicked, 'typeOfInput : ',typeOfInput);
	var orderProductLookupHeader = {
        headers: oHeaders, // object that contains HTTP headers as name value pairs
        requestUri: productLookupUri, // OData endpoint URI
        method: "GET",
        timeoutMS: 20000
	};
	if(!isPresent){
		OData.request(orderProductLookupHeader,
			function (data, response) {
				resultsLength=data.results.length;
				if(resultsLength==0 || (resultsLength==1 && data.results[0].msg=='No Data Found')){
					if(typeOfInput=='plu'){
						typeOfInput='article';
						productLookupUri = uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+articleSearchInput+"' and iv_site eq '"+site+"' and iv_ranged  eq 'X'";
						orderProductLookup(searchKey, articleSearchInput, productLookupUri, previousPage, typeOfInput, buttonClicked);
					}else{
						$('.loader').fadeOut();
						var sameSiteFlag=true;
						if(localStorage['previousPage']=='ibt'){
							var currentSite=productLookupUri.split("iv_site eq '")[1].split("'")[0];
							console.log(currentSite, site);
							if(currentSite!=localStorage['site']){
								console.log('setting flag false');
								sameSiteFlag=false;
							}
						}
						console.log(sameSiteFlag);
						if(productLookupUri.indexOf('iv_supplier')==-1 && sameSiteFlag==true){
							console.log('in if');
							if(localStorage['pageId']!='vendorSearchResults')
								$('#error-popup .popup-msg').text('Item not found');
							$('.overlay, #error-popup').fadeIn();
							centerAlign('#error-popup');
						}else{
							console.log('in else');
							localStorage['OPL_supplierCheckFlag']='true';
							productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article eq '"+articleSearchInput+"' and iv_site eq '"+localStorage['site']+"'";
							orderProductLookup(searchKey, articleSearchInput, productLookupUri, previousPage, typeOfInput, buttonClicked);
						}
						
						/*if(buttonClicked=='search'){
							errorOkPopup("Item not found","");
						}else{
							errorOkPopup("Item not ranged to supplier","");
						}*/
					}
				}else if(resultsLength==1){
					if(localStorage['OPL_supplierCheckFlag']=='true'){
						$('#error-popup .popup-msg').text('Article not ranged to supplier');
						if(localStorage['previousPage']=='ibt'){
							$('#error-popup .popup-msg').text('Article not ranged to site');
						}
						$('.overlay, #error-popup').fadeIn();
						centerAlign('#error-popup');
					}else{
						var itemNo=data.results[0].article.replace(/^0+/, '');
						var desc=data.results[0].description;
						var soh=data.results[0].stock_on_hand;
						var om=data.results[0].ord_mul;
						var baseQty= data.results[0].base_uom;
						var sos = data.results[0].src_of_supp;
						var vendorName = data.results[0].supp_name;
						var vendorNo = data.results[0].supp_no;
						var unitPrice = data.results[0].sales_price;
						var purchasePrice='';
						if(previousPage=='ibt'){
							purchasePrice= data.results[0].sales_price;
						}
						var department = data.results[0].department;
						var articleInformation=itemNo+" | "+desc+" | "+soh+" | "+om+" | "+baseQty+" | "+unitPrice+" | "+sos+" | "+vendorNo+" | "+vendorName+" | "+department+" | "+purchasePrice;
						if(buttonClicked=='search'){
							$('#articleNumber').text(itemNo);
							$('#description').text(desc);
							$('#articleInformation').val(articleInformation);
							$('.quantityOM').text(om);
							$('.OMContainer').fadeIn();
							$('.stockOnHand').text(soh);
							$('.barcode-details').fadeIn(500);
							$('.quantityBlk').removeClass('hide');
							$('#footer').show();
							$('.overlay, .loader').fadeOut(300);
							setHeight();
							refreshScroll();
						}else if(buttonClicked=='add'){
							localStorage['articleData']=JSON.stringify(data);
							var date = new Date();
						    var day = date.getDate();
						    var month = date.getMonth() + 1;
						    var year = date.getFullYear();
						    if (month < 10) month = "0" + month;
						    if (day < 10) day = "0" + day;
						    var today = year + "-" + month + "-" + day; 
						    if(previousPage=='createOrder'){
						    	var supplierNumberEntered = localStorage['searchSupplier_createOrder'];
						    	if(supplierNumberEntered.trim().length>0){
						    		if(vendorNo!=supplierNumberEntered){
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to warehouse');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    		}else{
						    			addToOrderList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['CO_Quantity'], localStorage['CO_DeliveryDate'], today, 'false', localStorage['supplierType_createOrder'], vendorNo, vendorName, department);
						    		}
						    	}else{
						    		localStorage['searchSupplierName_createOrder']=vendorName;
						    		localStorage['searchSupplier_createOrder']=vendorNo;
						    		if(vendorNo.trim().length!=0 || sos!='2'){
						    			localStorage['supplierType_createOrder']='vendor';
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to any warehouse');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    		}else{
						    			localStorage['supplierType_createOrder']='warehouse';
						    			addToOrderList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['CO_Quantity'], localStorage['CO_DeliveryDate'], today, localStorage['CO_EmergencyFlag'], localStorage['supplierType_createOrder'], vendorNo, vendorName, department);
						    		}
						    		console.log('SOS : ', localStorage['supplierType_createOrder']);
						    	}
						    }else if(previousPage=='createOrderOnReceipt'){
						    	var supplierNumberEntered = localStorage['searchSupplier_createOrderOnReceipt'];
						    	if(supplierNumberEntered.trim().length>0){
						    		if(vendorNo!=supplierNumberEntered){
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to vendor');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    		}else{
						    			addToOrderOnReceiptList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['COR_Quantity'], localStorage['COR_DeliveryDate'], today, localStorage['COR_EmergencyFlag'], localStorage['supplierType_createOrderOnReceipt'], vendorNo, vendorName, department);
						    		}
						    	}else{
						    		if(vendorNo.trim().length!=0 && sos=='1'){
						    			localStorage['supplierType_createOrderOnReceipt']='vendor';
						    			localStorage['searchSupplierName_createOrderOnReceipt']=vendorName;
						    			localStorage['searchSupplier_createOrderOnReceipt']=vendorNo;
						    			addToOrderOnReceiptList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['COR_Quantity'], localStorage['COR_DeliveryDate'], today, localStorage['COR_EmergencyFlag'], localStorage['supplierType_createOrderOnReceipt'], vendorNo, vendorName, department);
						    		}else{
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to any vendor');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    			localStorage['supplierType_createOrderOnReceipt']='warehouse';
						    		}
						    		
						    	}
						    }else if(previousPage=='createPreq'){
						    	var supplierNumberEntered = localStorage['searchSupplier_createPreq'];
						    	console.log(supplierNumberEntered);
						    	if(supplierNumberEntered.trim().length>0){
						    		if(vendorNo!=supplierNumberEntered){
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to vendor');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    		}else{
						    			addToPreqList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['CP_Quantity'], localStorage['CP_DeliveryDate'], today, localStorage['CP_EmergencyFlag'], localStorage['supplierType_createPreq'], vendorNo, vendorName, department);
						    		}
						    	}else{
						    		localStorage['searchSupplierName_createPreq']=vendorName;
						    		localStorage['searchSupplier_createPreq']=vendorNo;
						    		if(vendorNo.trim().length!=0 && sos=='1'){
						    			localStorage['supplierType_createPreq']='vendor';
						    			addToPreqList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['CP_Quantity'], localStorage['CP_DeliveryDate'], today, localStorage['CP_EmergencyFlag'], localStorage['supplierType_createPreq'], vendorNo, vendorName, department);
						    		}else{
						    			localStorage['supplierType_createPreq']='warehouse';
						    			$('.loader').fadeOut();
						    			$('#error-popup .popup-msg').text('Article not ranged to any vendor');
						    			$('.overlay, #error-popup').fadeIn();
						    			centerAlign('#error-popup');
						    		}
						    		console.log('SOS : ', localStorage['supplierType_createPreq']);
						    	}
						    }else if(previousPage=='addArticle'){
						    	var supplierNumberEntered = localStorage['searchSupplier_addArticle'];
						    	console.log(supplierNumberEntered);
						    	if(localStorage['AA_type']!='IBT' && vendorNo!=supplierNumberEntered){
						    		$('.loader').fadeOut();
						    		$('#error-popup .popup-msg').text('Article not ranged to vendor');
						    		$('.overlay, #error-popup').fadeIn();
						    		centerAlign('#error-popup');
						    	}else{
						    		var searchResultslength=0;
						    		if(wool.tableExists("OrderArticleTable")){
						    			searchResultslength = wool.query("OrderArticleTable").length;
						    		}
						    		itemNumber=(searchResultslength*10)+10;
						    		addArticleToOrder(itemNo, desc, om, baseQty, itemNumber);
						    	}
						    }else if(previousPage=='ibt'){
						    	var salesOrg=localStorage['salesOrg'];
						    	if(salesOrg!=salesOrg){
						    		console.log('Petrol Store validation ');
						    		errorOkPopup("Order cannot be created across Sales Orgs","");
						    	}else{
						    		addToTransferList(itemNo, desc, soh, om, baseQty, unitPrice, localStorage['CI_Quantity'], localStorage['CI_DeliveryDate'], today, localStorage['CI_EmergencyFlag'], localStorage['supplierType_ibt'], localStorage['searchSupplier_ibt'], localStorage['searchSupplierName_ibt'], purchasePrice, department, false, 'CAR');
						    	}
						    }
	
						}
					}
				}else{
					for(var i=0; i<resultsLength; i++){
						var itemNo=data.results[i].article.trim();
						var description=data.results[i].description.trim();
						var soh=data.results[i].stock_on_hand;
						var om=data.results[i].ord_mul;
						var baseQty= data.results[i].base_uom;
						var sos = data.results[i].src_of_supp;
						var vendorName = data.results[i].supp_name;
						var vendorNo = data.results[i].supp_no;
						var unitPrice = data.results[i].sales_price;
						var purchasePrice='';
						if(previousPage=='ibt'){
							purchasePrice= data.results[i].sales_price;
						}
						var department = data.results[i].department;
						insertIntoArticleSearchresults(searchKey, articleSearchInput, itemNo, description, soh, om, baseQty, unitPrice, sos, vendorNo, vendorName, purchasePrice, department);
					}
					localStorage['ASR_SearchTerm']=searchKey;
					console.log('Show ArticleSearch Results');
					localStorage['ASR_previousPage']=localStorage['pageId'];
					localStorage['pageId']='articleSearchResults';
					window.location='articleSearchResults.html';
				}
			},function(err){
				console.log(err);
			}
		);
	}else{
		console.log(articleSearchInput, ' isPresent');
		console.log('Show ArticleSearch Results : ', searchKey);
		localStorage['ASR_SearchTerm']=searchKey;
		localStorage['ASR_previousPage']=localStorage['pageId'];
		localStorage['pageId']='articleSearchResults';
		window.location='articleSearchResults.html';
	}
}

function selectArticle(){
	var selectedArticle=$("input:radio[name=article]:checked").val();
	localStorage['fromArticleSearchResults']='';
	console.log('selectedArticle : ', selectedArticle);
	var itemNo = selectedArticle.split(' | ')[0];
    var isArticlePresent=0;
    var tableName='OrderListTable';
    if(localStorage['previousPage']=='addArticle'){
    	tableName='OrderArticleTable';
    	if(wool.tableExists(tableName)){
			isArticlePresent=wool.query(tableName,{ArticleNo : itemNo}).length;
		}
    }else{
	    if(localStorage['previousPage']=='createPreq'){
	    	tableName='PreqListTable';
	    }else if(localStorage['previousPage']=='createOrderOnReceipt'){
	    	tableName='CORListTable';
	    }else if(localStorage['previousPage']=='ibt'){
	    	tableName='IBTListTable';
	    }
		if(wool.tableExists(tableName)){
			isArticlePresent=wool.query(tableName,{ItemNo : itemNo}).length;
		}
    }
	if(isArticlePresent>0){
		$('.loader').fadeOut();
		$('#error-popup .popup-msg').text('Article already present in list');
		$('.overlay, #error-popup').fadeIn();
		centerAlign('#error-popup');
	}else{
		localStorage['fromArticleSearchResults']=selectedArticle;
		//localStorage['displaySaved']='false';
		localStorage['S_ArticleSelected']='true';
		localStorage['pageId']=localStorage['previousPage'];
		window.location=localStorage['previousPage']+'.html';
	}
}

function addToOrderList(itemNo, desc, soh, om, uom, unitPrice, quantity, deliveryDate, rosterDate, emergencyFlag, supplierType, vendorNo, vendorName, department){
	 if(!wool.tableExists("OrderListTable")){
		 console.log('OrderListTable does not exist');
			wool.createTable("OrderListTable", ["ItemNo", "Description", "SOH", "OM", "UOM", "UnitPrice", "Quantity", "DeliveryDate", "RosterDate", "EmergencyFlag", "SupplierType", "VendorNo", "VendorName", "Department", "NewFlag"]);
			console.log('OrderListTable created');
	 }
	 wool.commit();
	 var isPresent='false';
	 if(localStorage['pageId']!='orderListEdit'){
		 var resultLength=wool.query("OrderListTable",{ItemNo : itemNo}).length;
		 if(resultLength>=1){
			 isPresent='true';
		 }
	 }
	 console.log('isPresent : ', isPresent);
	 var newFlag=false;
	 if(isPresent=='true'){
		 newFlag=false;
	 }
	 wool.insertOrUpdate("OrderListTable", {ItemNo: itemNo}, {   
		 ItemNo : itemNo, 
		 Description : desc, 
		 SOH : soh, 
		 OM : om, 
		 UOM : uom, 
		 UnitPrice: unitPrice,
		 Quantity : quantity,
		 DeliveryDate : deliveryDate,
		 RosterDate : rosterDate,
		 EmergencyFlag : emergencyFlag,
		 SupplierType : supplierType,
		 VendorNo : vendorNo,
		 VendorName : vendorName,
		 Department: department,
		 NewFlag : newFlag
	 });
	 wool.commit();
	 console.log('IN orderListEdit');
	 wool.insertOrUpdate("OrderListTable", {}, {   
		 DeliveryDate : deliveryDate
	 });
	 wool.commit();
	 console.log('Item '+itemNo+' inserted');
	 var numberOfItemsOrdered = wool.query("OrderListTable").length;
	 console.log('numberOfItemsOrdered : ', numberOfItemsOrdered);
	 $('.no-of-items').text(numberOfItemsOrdered);
	 $('#search-input').val('');
	 $('.quantity').val('');
	 $('.quantityOM').text('');
	 $('.OMContainer').fadeOut();
	 $('.stockOnHand').text('');
	 $('.barcode-details').hide();
	 $('.quantityBlk').addClass('hide');
	 $('#footer').hide();
	 $('#header-right').fadeIn(300);
	 if(numberOfItemsOrdered==1){
		 $('.search-block').hide();
		 $('.article-added-info').fadeIn(300);
			$('#footer').show();
	 }
	 if(numberOfItemsOrdered>0){
		$('.delivery-date').val(localStorage['Order_deliveryDate']);
		$('.delivery-date').attr('disabled', 'disabled');
		var suppliertype = localStorage['supplierType_createOrder'];
		var radioId="#"+suppliertype;
		$(radioId).attr('checked', 'checked');
		$('input:radio[name=supplierType]').attr('disabled', 'disabled');
		if(suppliertype=='warehouse'){
			$('#warehouse-list').removeAttr('checked', 'checked');
			var selectedWarehouse=localStorage['searchSupplier_createOrder'];
			$('#warehouse-list').val(selectedWarehouse);
			$('#warehouse-list').attr('disabled', 'disabled');
			$('.warehouse-container').show();
		}
	}
	 $('.overlay, .loader').fadeOut();
	 if(localStorage['pageId']!='createOrder' && localStorage['pageId']!='orderList'){
		 localStorage['displaySaved']='false';
		 localStorage['pageId']='createOrder';
		 window.location='createOrder.html';
	 }
	 setHeight();
	refreshScroll();
}

function addToPreqList(itemNo, desc, soh, om, uom, unitPrice, quantity, deliveryDate, rosterDate, emergencyFlag, supplierType, vendorNo, vendorName, department){
	 if(!wool.tableExists("PreqListTable")){
		 console.log('PreqListTable does not exist');
			wool.createTable("PreqListTable", ["ItemNo", "Description", "SOH", "OM", "UOM", "UnitPrice", "Quantity", "DeliveryDate", "RosterDate", "EmergencyFlag", "SupplierType", "VendorNo", "VendorName", "Department", "NewFlag"]);
			console.log('PreqListTable created');
	 }
	 wool.commit();
	 var isPresent='false';
	 if(localStorage['pageId']!='orderListEdit'){
		 var resultLength=wool.query("PreqListTable",{ItemNo : itemNo}).length;
		 if(resultLength>=1){
			 isPresent='true';
		 }
	 }
	 var newFlag=false;
	 console.log('isPresent : ', isPresent);
	 if(isPresent=='true'){
		 newFlag=false;
	 }
	 wool.insertOrUpdate("PreqListTable", {ItemNo: itemNo}, {   
		 ItemNo : itemNo, 
		 Description : desc, 
		 SOH : soh, 
		 OM : om, 
		 UOM : uom, 
		 UnitPrice : unitPrice,
		 Quantity : quantity,
		 DeliveryDate : deliveryDate,
		 RosterDate : rosterDate,
		 EmergencyFlag : emergencyFlag,
		 SupplierType : supplierType,
		 VendorNo : vendorNo,
		 VendorName : vendorName,
		 Department : department,
		 NewFlag : newFlag
	 });
	 wool.commit();
	 console.log('IN orderListEdit');
	 wool.insertOrUpdate("PreqListTable", {}, {   
		 DeliveryDate : deliveryDate
	 });
	 wool.commit();
	 console.log('Item '+itemNo+' inserted');
	 var numberOfItemsOrdered = wool.query("PreqListTable").length;
	 console.log('numberOfItemsOrdered : ', numberOfItemsOrdered);
	 $('.no-of-items').text(numberOfItemsOrdered);
	 $('#search-input').val('');
	 $('.quantity').val('');
	 $('.quantityOM').text('');
	 $('.OMContainer').fadeOut();
	 $('.stockOnHand').text('');
	 $('.barcode-details').hide();
	 $('.quantityBlk').addClass('hide');
	 $('#footer').hide();
	 $('#header-right').fadeIn(300);
	 if(numberOfItemsOrdered==1){
		 $('.search-block').hide();
		 $('.article-added-info').fadeIn(300);
			$('#footer').show();
	 }
	 if(numberOfItemsOrdered>0){
		var suppliertype = localStorage['supplierType_createPreq'];
		var radioId="#"+suppliertype;
		$(radioId).attr('checked', 'checked');
		$('input:radio[name=supplierType]').attr('disabled', 'disabled');
		if(suppliertype=='vendor'){
			$('#vendor-input').val(localStorage['searchSupplier_createPreq']+" | "+localStorage['searchSupplierName_createPreq']).attr('disabled', 'disabled').show();
			$('.vendor-container').show();
		}
	}
	 $('.overlay, .loader').fadeOut();
	 if(localStorage['pageId']!='createPreq' && localStorage['pageId']!='orderList'){
		 localStorage['displaySaved']='false';
		 localStorage['pageId']='createPreq';
		 window.location='createPreq.html';
	 }
	 setHeight();
		refreshScroll();
}
		
function addToTransferList(itemNo, desc, soh, om, uom, unitPrice, quantity, deliveryDate, rosterDate, emergencyFlag, supplierType, supplierNo, supplierName, purchasePrice, department, selectedUom){
	console.log(selectedUom);
	 if(!wool.tableExists("IBTListTable")){
		 console.log('IBTListTable does not exist');
			wool.createTable("IBTListTable", ["ItemNo", "Description", "SOH", "OM", "UOM", "UnitPrice", "Quantity", "DeliveryDate", "RosterDate", "EmergencyFlag", "SupplierType", "VendorNo", "VendorName", "PurchasePrice", "Department", "NewFlag", "SelectedUom"]);
			console.log('IBTListTable created');
	 }
	 wool.commit();
	 var isPresent='false';
	 if(localStorage['pageId']!='ibtListEdit'){
		 var resultLength=wool.query("IBTListTable",{ItemNo : itemNo}).length;
		 if(resultLength>=1){
			 isPresent='true';
		 }
	 }
	 console.log('isPresent : ', isPresent);
	 var newFlag=false;
	 if(isPresent=='true'){
		 newFlag=false;
	 }
	 wool.insertOrUpdate("IBTListTable", {ItemNo: itemNo}, {   
		 ItemNo : itemNo, 
		 Description : desc, 
		 SOH : soh, 
		 OM : om, 
		 UOM : uom, 
		 UnitPrice : unitPrice,
		 Quantity : quantity,
		 DeliveryDate : deliveryDate,
		 RosterDate : rosterDate,
		 EmergencyFlag : emergencyFlag,
		 SupplierType : supplierType,
		 VendorNo : supplierNo,
		 VendorName : supplierName,
		 PurchasePrice : purchasePrice,
		 Department : department,
		 NewFlag : newFlag,
		 SelectedUom : selectedUom
	 });
	 wool.commit();
	 console.log('IN orderListEdit');
	 wool.insertOrUpdate("IBTListTable", {}, {   
		 DeliveryDate : deliveryDate
	 });
	 wool.commit();
	 console.log('Item '+itemNo+' inserted');
	 var numberOfItemsOrdered = wool.query("IBTListTable").length;
	 console.log('numberOfItemsOrdered : ', numberOfItemsOrdered);
	 $('.no-of-items').text(numberOfItemsOrdered);
	 $('#search-input').val('');
	 $('.quantity').val('');
	 $('.quantityOM').text('');
	 $('.OMContainer').fadeOut();
	 $('.stockOnHand').text('');
	 $('.barcode-details').hide();
	 $('.quantityBlk').addClass('hide');
	 $('#footer').hide();
	 $('#header-right').fadeIn(300);
	 if(numberOfItemsOrdered==1){
		 $('.search-block').hide();
		 $('.article-added-info').fadeIn(300);
			$('#footer').show();
	 }
	 if(numberOfItemsOrdered>0){
		$('.delivery-date').val(localStorage['Order_deliveryDate']);
		$('.delivery-date').attr('disabled', 'disabled'); 
		var suppliertype = localStorage['supplierType_ibt'];
		var radioId="#"+suppliertype;
		$(radioId).attr('checked', 'checked');
		$('input:radio[name=supplierType]').attr('disabled', 'disabled');
		if(suppliertype=='warehouse'){
			$('#warehouse-list').removeAttr('checked', 'checked');
			var selectedWarehouse=localStorage['searchSupplier_ibt'];
			$('#warehouse-list').val(selectedWarehouse);
			$('#warehouse-list').attr('disabled', 'disabled');
			$('.warehouse-container').show();
		}else if(suppliertype=='store'){
			$('#store-input').val(localStorage['searchSupplier_ibt']+" | "+localStorage['searchSupplierName_ibt']).attr('disabled', 'disabled').show();
			$('.store-container').show();
		}
	}
	 $('.overlay, .loader').fadeOut();
	 if(localStorage['pageId']!='ibt' && localStorage['pageId']!='orderList'){
		 localStorage['displaySaved']='false';
		 localStorage['pageId']='ibt';
		 window.location='ibt.html';
	 }
	 setHeight();
		refreshScroll();
}

function addToOrderOnReceiptList(itemNo, desc, soh, om, uom, unitPrice, quantity, deliveryDate, rosterDate, emergencyFlag, supplierType, supplierNo, supplierName, department){
	 if(!wool.tableExists("CORListTable")){
		 console.log('CORListTable does not exist');
			wool.createTable("CORListTable", ["ItemNo", "Description", "SOH", "OM", "UOM", "UnitPrice", "Quantity", "DeliveryDate", "RosterDate", "EmergencyFlag", "SupplierType", "VendorNo", "VendorName", "Department", "NewFlag"]);
			console.log('CORListTable created');
	 }
	 wool.commit();
	 var isPresent='false';
	 if(localStorage['pageId']!='orderListEdit'){
		 var resultLength=wool.query("CORListTable",{ItemNo : itemNo}).length;
		 if(resultLength>=1){
			 isPresent='true';
		 }
	 }
	 console.log('isPresent : ', isPresent);
	 var newFlag=false;
	 if(isPresent=='true'){
		 newFlag=false;
	 }
	 wool.insertOrUpdate("CORListTable", {ItemNo: itemNo}, {   
		 ItemNo : itemNo, 
		 Description : desc, 
		 SOH : soh, 
		 OM : om, 
		 UOM : uom, 
		 UnitPrice : unitPrice,
		 Quantity : quantity,
		 DeliveryDate : deliveryDate,
		 RosterDate : rosterDate,
		 EmergencyFlag : emergencyFlag,
		 SupplierType : supplierType,
		 VendorNo : supplierNo,
		 VendorName : supplierName,
		 Department : department,
		 NewFlag : newFlag
	 });
	 wool.commit();
	 wool.insertOrUpdate("CORListTable", {}, {   
		 DeliveryDate : deliveryDate
	 });
	 wool.commit();
	 console.log('Item '+itemNo+' inserted');
	 var numberOfItemsOrdered = wool.query("CORListTable").length;
	 console.log('numberOfItemsOrdered : ', numberOfItemsOrdered);
	 $('.no-of-items').text(numberOfItemsOrdered);
	 $('#search-input').val('');
	 $('.quantity').val('');
	 $('.quantityOM').text('');
	 $('.OMContainer').fadeOut();
	 $('.stockOnHand').text('');
	 $('.barcode-details').hide();
	 $('.quantityBlk').addClass('hide');
	 $('#footer').hide();
	 $('#header-right').fadeIn(300);
	 if(numberOfItemsOrdered==1){
		 $('.search-block').hide();
		 $('.article-added-info').fadeIn(300);
			$('#footer').show();
	 }
	 if(numberOfItemsOrdered>0){
		$('.delivery-date').val(localStorage['Order_deliveryDate']);
		$('.delivery-date').attr('disabled', 'disabled');
		$('.no-of-items').text(numberOfItemsOrdered);
		$('#header-right').fadeIn(300);
		var suppliertype = localStorage['supplierType_createOrderOnReceipt'];
		var radioId="#"+suppliertype;
		$(radioId).attr('checked', 'checked');
		$('input:radio[name=supplierType]').attr('disabled', 'disabled');
		if(suppliertype=='vendor'){
			$('#vendor-input').val(localStorage['searchSupplier_createOrderOnReceipt']+" | "+localStorage['searchSupplierName_createOrderOnReceipt']).attr('disabled', 'disabled').show();
			$('.vendor-container').show();
		}
	}
	$('.overlay, .loader').fadeOut();
	if(localStorage['pageId']!='createOrderOnReceipt' && localStorage['pageId']!='orderList'){
		localStorage['displaySaved']='false';
		localStorage['pageId']='createOrderOnReceipt';
		window.location='createOrderOnReceipt.html';
	}
	setHeight();
	refreshScroll();
}