$(document).ready(function(){
	$("input:radio[name=sourceOfSupply]").click(function() {
		var source=$(this).val().toLowerCase();
		console.log('Selected source : ', source);
		selectSource(source);
	});
});

function fillSelectField(code, id) {
	console.log(code, id);
	var salesOrg=localStorage['salesOrg'];
	if(code=="default"){
		console.log("IN DEF");
		if(id=="coarseDept"){
			$('#coarseDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#coarseDept').attr("disabled", "disabled");
			$('#fineDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}else if(id=="fineDept"){
			$('#fineDept').children().remove().end().append('<option selected value="default">Select</option>');
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}else if(id=="subsection"){
			$('#subsection').children().remove().end().append('<option selected value="default">Select</option>');
		}
	}
	else{
		console.log("IN");
		var getDepartmentsUri = uriPrefix+"ZSP_ARTICLE_HIERARCHY/zsp_article_hierarchyCollection?$filter=iv_s_org eq '"+salesOrg+"' and iv_parent_node eq '"+code+"' and iv_dc eq '10'";
		var getDepartmentsHeader = {
			headers : oHeaders, 
			requestUri : getDepartmentsUri, 
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
	}else */
	if(source=='warehouse'){
		$('#sourceSearch').attr("placeholder", "Enter partial/ complete warehouse no or name.").val('').removeAttr("disabled").focus();
		$('#vendor').attr("disabled", "disabled");
		$('#vendor').children().remove().end().append('<option selected value="default">Select supplier</option>');
	}else if(source=='direct-vendor'){
		$('#sourceSearch').attr("placeholder", "Enter partial/ complete vendor name.").val('').removeAttr("disabled").focus();;
		$('#vendor').attr("disabled", "disabled");
		$('#vendor').children().remove().end().append('<option selected value="default">Select supplier</option>');
	}
}

function populateVendors(){
	if($('#sourceSearch').val()!=''){
		$('.overlay, .loader').fadeIn(500);
		centerAlign('.loader');
		var sourceOfSupply=$("input:radio[name=sourceOfSupply]:checked").val();
		console.log('sourceOfSupply : ', sourceOfSupply);
		if(sourceOfSupply=='direct-vendor'){
			var vendor=$('#sourceSearch').val();
			if ($.isNumeric(vendor)){
				getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_no eq '"+vendor+"'";
			}else{
				getSuppliersUri=uriPrefix+"ZSP_VENDOR_SEARCH/zsp_vendor_searchCollection?$filter=iv_vendor_name eq '"+vendor+"*'";
			}
			getSuppliers(getSuppliersUri, 'vendor');
		}else if(sourceOfSupply=='warehouse'){
			var warehouse=$('#sourceSearch').val();
			if ($.isNumeric(warehouse)){
				getSuppliersUri=uriPrefix+"ZSP_WAREHOUSE_LOOKUP/zsp_warehouse_lookupCollection?$filter=iv_site_no eq '"+warehouse+"'";
			}else{
				getSuppliersUri=uriPrefix+"ZSP_WAREHOUSE_LOOKUP/zsp_warehouse_lookupCollection?$filter=iv_site_name eq '"+warehouse+"*'";
			}
			getSuppliers(getSuppliersUri, 'warehouse');
		}
	}
}

function getSuppliers(getSuppliersUri, sourceOfSupply){
	var getDepartmentsHeader = {
		headers : oHeaders, 
		requestUri : getSuppliersUri,
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
					}else if(sourceOfSupply=='warehouse'){
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
				}else if(sourceOfSupply=='warehouse'){
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
			articleContent="iv_desc eq '*"+productSearchInput+"' and ";
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
			console.log("default : error");
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
		}
	}else{
		localStorage['searchTerm']=subsection+" | "+articleFlag+" | "+rangedFlag;
		console.log("Segment selected : ",subsection );
		localStorage['typeOfInput']='advanced';
		productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?"+filterContent+"iv_hier_node eq '"+subsection+"' and iv_site eq '"+site+"'";
	}
	console.log(productLookupUri);
	productLookup(productLookupUri);
}