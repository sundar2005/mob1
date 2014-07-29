var wool = new localStorageDB("WoolworthsIM", localStorage);
var pageId = localStorage["pageId"];
createAllTables(pageId);
console.log("page : ", pageId);
function updateOrderList(){
	//wool.dropTable("viewOrder");
}
function createAllTables(pageId) {
	console.log(pageId);
/*	if (pageId == "WoWHome") {
		
			localStorage['firstTimeSearch']='true';
	}*/
	if (pageId == "stockAdjust") {
		if (!wool.tableExists("WoolworthsDB")) {
			wool.createTable("WoolworthsDB", [ "Item", "Description",
					"Adjustment", "SOH", "Reason", "Uom" ]);
		} else {
			getItemDetails();
		}
	} else if (pageId == "LookupList") {
		console.log(window.location.href);
		console.log(localStorage['searchTerm']);
		// var searchTerm=localStorage['searchTerm'];
		/*
		 * if(!wool.tableExists("SearchHistoryDB")){
		 * console.log('SearchHistoryDB does not exist');
		 * wool.createTable("SearchHistoryDB", ["SearchTerm"]);
		 * console.log('SearchHistoryDB created'); }
		 */
		if (!wool.tableExists("LookupDB")) {
			console.log('LookupDB does not exist');
			wool.createTable("LookupDB", [ "SearchTerm", "Item", "Description",
					"Ranged", "SOH" ]);
			console.log('LookupDB created');
		}
		// if(wool.tableExists("LookupDB") &&
		// wool.tableExists("SearchHistoryDB")){
		/*
		 * else { console.log('Table exists'); if (searchTerm != "undefined") {
		 * var isPresent=false; if(localStorage['typeOfInput']!='advanced'){ var
		 * searchKey=searchTerm+" | "+'SearchResults'; isPresent =
		 * findSearchTerm(searchKey); }else{ isPresent =
		 * findSearchTerm(searchTerm); } if (isPresent) {
		 * console.log('isPresent'); $('#search-input').val(searchTerm);
		 * populateSearchResults(searchTerm); } else {
		 * console.log('isNotPresent'); saveSearchTerm(searchTerm); } } else {
		 * console.log("UNDEFINED SEARCH TERM."); } }
		 */
	} else if (pageId == "createOrder") {
		if (!wool.tableExists("vendorTable")) {
			wool.createTable("vendorTable", [ "Vendor", "Item", "Description",
					"Qty", "SOH", "RosterDate", "DeliveryDate", "UOM", "OM" ]);
			console.log('Vendor Table created');
		} else {
			populateVendorTable();
		}
	} else if (pageId == "viewOrder") {
		console.log('viewOrder page');
		var fromAdvSearchPage = localStorage['fromAdvSearchPage'];
		var lookupOrder = localStorage['fromlookupOrder'];
		var firstTymSearch = localStorage['firstTimeSearch'];
		//var reloadFlag=localStorage['reloadOrders'];
		if (fromAdvSearchPage == "false") {
			if (lookupOrder == "false") {
				//if (firstTymSearch == "true") {
					if (wool.tableExists("viewOrder")) {
						wool.dropTable("viewOrder");
					}
					console.log('viewOrder table does not exist');
					wool.createTable("viewOrder", [ "Vendor", "OrderNo",
							"DeliveryDate", "CreationDate", "ReceivingStore",
							"SendingStore", "CartonsNo", "OrderType",
							"OrderTypeDescription", "OrderStatus",
							"RosterDate", "SupplierNo", "SupplierName", "DepartmentNo" ]);
					console.log('viewOrder Table created');
					console.log('calling orderListStorage');
					localStorage['firstTimeSearch']='false';
					var order_no = "";
					orderListStorage(order_no);
				/*} else {
					console.log('calling populateViewOrderTable');
					populateViewOrderTable();
				}*/

			} else {
				/*if (firstTymSearch== "false") {
					console.log('calling populateViewOrderTable');
					populateViewOrderTable();

				} else {*/
					localStorage['firstTimeSearch'] = false;
					var lookupOrderInput = localStorage['lookupOrderInput'];
					console.log('lookupOrderInput',lookupOrderInput);
					onSearch(lookupOrderInput);
					
				//}
			}
		} else {

			//if (firstTymSearch == "true") {
				wool.dropTable("viewOrder");
				console.log('viewOrder table does not exist');
				wool.createTable("viewOrder", [ "Vendor", "OrderNo",
						"DeliveryDate", "CreationDate", "ReceivingStore",
						"SendingStore", "CartonsNo", "OrderType",
						"OrderTypeDescription", "OrderStatus", "RosterDate",
						"SupplierName", "DepartmentNo" ]);
				console.log('viewOrder Table created');
				console.log('calling orderListStorage');
				localStorage['firstTimeSearch'] = 'false';
				var order_no = "";
				orderListStorage(order_no);

			/*} else {
				console.log('calling populateViewOrderTable');
				populateViewOrderTable();
				
			}*/

		}

	} else if (pageId == "viewOrderDetails") {
		
		$(".overlay,.loader").fadeIn();
		centerAlign(".loader");
		console.log('viewOrderDetails page');
		/*if (!wool.tableExists("viewOrderDetails")) {

			console.log('viewOrderDetails table does not exist');
			wool.createTable("viewOrderDetails", [ 'OrderNo', 'OrderType',
					'Vendor', 'TradingDept', 'Temperature', 'CartonsNo',
					'InvoiceNo', 'InvoiceTotal', 'Gst', 'DeliveryDocNo',
					'SendingStore', 'ReceivingStore', 'Value' ]);
			console.log('viewOrderDetails Table created');
		}
		if (!wool.tableExists('viewOrderDetailItems')) {
			console.log('viewOrderDetailItems table does not exist');
			wool.createTable("viewOrderDetailItems", [ 'OrderArticleNo',
					'OrderNo', 'ReceivedFlag', 'Article', 'ItemNo', 'ItemDesc',
					'PackSize', 'OrderedQty', 'ReceivedQty' ]);
			console.log('viewOrderDetailItems Table created');
		}
		if (wool.tableExists('viewOrderDetails') && wool.tableExists('viewOrderDetailItems')) {
			console.log('viewOrderDetails table exists');
			$(".overlay,.loader").fadeIn();*/
			var orderNo = localStorage['orderNo'];
			var orderType=localStorage['orderType'];
			console.log('calling displayorderdetails. orderNo : ', orderNo);
			orderListDetails(orderNo,orderType);
//		}
	}

	wool.commit();
}

// --------------- View Order starts

function insertIntoViewOrderTable(vendor, orderNo, deliveryDate, creationDate,
		receivingStore, sendingStore, cartonsNo, orderType,
		orderTypeDescription, orderStatus, rosterDate, supplierNo, supplierName,
		departmentNo) {
	console.log(orderTypeDescription);
	if(orderTypeDescription=="Purchase requisition"){
		console.log('orderTypeDescription');
		orderTypeDescription='PReq';
	}
	console.log(orderTypeDescription);
	console.log('Inserting into viewOrder: ', vendor, orderNo, deliveryDate,
			creationDate, receivingStore, sendingStore, cartonsNo, orderType,
			orderTypeDescription, orderStatus, rosterDate, supplierName,
			departmentNo);
	wool.insert("viewOrder", {
		Vendor : vendor,
		OrderNo : orderNo,
		DeliveryDate : deliveryDate,
		CreationDate : creationDate,
		ReceivingStore : receivingStore,
		SendingStore : sendingStore,
		CartonsNo : cartonsNo,
		OrderType : orderType,
		OrderTypeDescription : orderTypeDescription,
		OrderStatus : orderStatus,
		RosterDate : rosterDate,
		SupplierNo : supplierNo,
		SupplierName : supplierName,
		DepartmentNo : departmentNo
	});
	wool.commit();
}

function populateViewOrderTable() {
	console.log("inside populate Table");
	var searchResults = wool.query("viewOrder");
	for ( var i = 0; i < (searchResults.length); i++) {

		var orderNo = searchResults[i].OrderNo;
		var deliveryDate = searchResults[i].DeliveryDate;
		var creationDate = searchResults[i].CreationDate;
		if (creationDate == null) {
			creationDate = "";
		}
		//var receivingStore = searchResults[i].ReceivingStore;
		var sendingStore = searchResults[i].SendingStore;
		var cartonsNo = searchResults[i].CartonsNo;
		cartonsNo = parseFloat(cartonsNo);
		var orderType = searchResults[i].OrderType;
		var orderTypeDescription = searchResults[i].OrderTypeDescription;
		consoole.log('orderTypeDescription : ', orderTypeDescription);
		var orderStatus = searchResults[i].OrderStatus;
		var supplierNo=searchResults[i].SupplierNo;
		var box;
		if (orderStatus == "Cancelled") {
			box = "notreceived-box";
		} else {
			box = "received-box";
		}
		//svar rosterDate = searchResults[i].RosterDate;
		var supplierName = searchResults[i].SupplierName;
		var departmentNo = searchResults[i].DepartmentNo;
		var item = "";
		console.log('cartonsNo(search): ', cartonsNo, ' results: ', searchResults[i]);
		if (orderType == 'ZUB') {
			/*item = '<div class="levelThree"><div class="levelTwo '+orderStatus+'"></div>'
		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		     +'<tbody><tr><td class="item-desc-txt grey"><span class="orderTypeDescription">'+orderTypeDescription+'</span> #<span class="orderNo">'+orderNo+'</span></td><td class="item-desc-val grey articleNo"><span class="cartons-no-lukup-list">'
		     +cartonsNo+'</span>&nbsp;Cartons</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div">'
		     +supplierName+'</div><input type="hidden" class="orderDeliveryDate" value="'+deliveryDate+'">'
		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		     +'<input type="hidden" class="orderType" value="'+orderType+'">'
		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		     +'<img src="../images/orderResultRightArrow.png" class="to-lookup-details"></td></tr>'
		     +'<tr><td colspan="2"><span id ="orderSts" class=" '+box+'">'+orderStatus+'</span></td></tr>'
		     +'</tbody></table></div></div>';*/
			
			item = '<div class="levelThree"><div class="levelTwo '+orderStatus+'"></div>'
		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel  font14 ranged">'
		     +'<tbody><tr><td class="item-desc-txt grey"><span class="orderTypeDescription green bold">Order&nbsp;#</span><span class="orderNo green bold">'+orderNo+'</span><span class="grey absoluteRight">'
		     +orderTypeDescription+'</span></td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div normal">'
		     +supplierNo+" | "+supplierName+'</div><input type="hidden" class="orderDeliveryDate" value="'+deliveryDate+'">'
		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		     +'<input type="hidden" class="orderType" value="'+orderType+'">'
		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		     +'<tr><td colspan="2"><span id ="orderSts" class=" '+box+'">'+orderStatus+'</span>'
			 +'<span class="grey absoluteRight">Total Cartons:&nbsp;'
		     +cartonsNo+'</span></td></tr>'
		     +'</tbody></table></div></div>';
			

		} else {
			/*item = '<div class="levelThree"><div class="levelTwo '+orderStatus+'"></div>'
		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel bold font14 ranged">'
		     +'<tbody><tr><td class="item-desc-txt grey"><span class="orderTypeDescription">'+orderTypeDescription+'</span> #<span class="orderNo">'+orderNo+'</span></td><td class="item-desc-val grey articleNo"><span class="cartons-no-lukup-list">'
		     +cartonsNo+'</span>&nbsp;Cartons</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div">'
		     +supplierName+'</div><input type="hidden" class="orderDeliveryDate" value="'+deliveryDate+'">'
		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		     +'<input type="hidden" class="orderType" value="'+orderType+'">'
		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		     +'<img src="../images/orderResultRightArrow.png" class="to-lookup-details"></td></tr>'
		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span></td></tr>'
		     +'</tbody></table></div></div>';*/
			item = '<div class="levelThree"><div class="levelTwo '+orderStatus+'"></div>'
		     +'<div class="levelOne"><table class="lukup-lst-itm fontHel  font14 ranged">'
		     +'<tbody><tr>'
			 +'<td class="item-desc-txt "><span class="orderTypeDescription green bold">Order &nbsp;#</span> <span class="orderNo green bold">'+orderNo+'</span><span class="grey absoluteRight">'
		     +orderTypeDescription+'</td></tr><tr><td colspan="2" class="item-desc-val grey description suppName"><div class="to-lookup-Div normal">'
		     +supplierNo+" | "+supplierName+'</div><input type="hidden" class="orderDeliveryDate" value="'+deliveryDate+'">'
		     +'<input type="hidden" class="departmentNo" value="'+departmentNo+'">'
		     +'<input type="hidden" class="orderType" value="'+orderType+'">'
		     +'<input type="hidden" class="sendingStore" value="'+sendingStore+'">'
		     +'<img src="../images/iconArrowRight.png" class="to-lookup-details"></td></tr>'
		     +'<tr><td colspan="2"><span id ="orderSts" class="'+box+'">'+orderStatus+'</span>'
			 +'<span class="grey absoluteRight">Total Cartons:&nbsp;'
		     +cartonsNo+'</span></td></tr>'
		     +'</tbody></table></div></div>';

		}

		var t = $("#viewOrder-details");
		t.append(item);

	}

	$('.overlay, .loader').fadeOut(300);
	refreshScroll();
	onClickViewOrder();
}

// ---------------- View Order ends

// ------------------LookUp starts----------------------
function findSearchTerm(searchTerm) {
	console.log('Finding search term : ', searchTerm);
	if (wool.tableExists('LookupDB')) {
		var isFound = wool.query("LookupDB", {
			SearchTerm : searchTerm
		});
		console.log(isFound);
		if (isFound.length > 0) {
			console.log(searchTerm, ' found', 'Number of items : ',
					isFound.length);
			return true;
		} else {
			console.log(searchTerm, ' not found');
			return false;
		}
	} else {
		console.log('\n LookupDB is not initialised');
		wool.createTable("LookupDB", [ "SearchTerm", "Item", "Description",
		           					"Ranged", "SOH" ]);
		console.log('\n LookupDB created');
		return false;
	}

}
/*
 * function saveSearchTerm(searchTerm){ console.log('Saving search term : ',
 * searchTerm); wool.insertOrUpdate("SearchHistoryDB", {SearchTerm :
 * searchTerm}, {SearchTerm : searchTerm}); wool.commit(); }
 */

function insertSearchResult(searchTerm, item, description, ranged, soh) {
	console.log('Inserting into LookUpDB: ', item, description, ranged, soh);
	wool.insert("LookupDB", {
		SearchTerm : searchTerm,
		Item : item,
		Description : description,
		Ranged : ranged,
		SOH : soh
	});
	wool.commit();
}

function populateSearchResults(searchTerm){
	if(localStorage['fromHomeToStock']!='undefined' && localStorage['fromHomeToStock']=='true'){
		prevPage='stockAdjust';
	}
	var tabClicked=localStorage['tabClicked'];
	if(tabClicked=='SearchResults'){

		$('.greenSep-left').css('visibility', 'visible');
		$('.greenSep-right').css('visibility', 'hidden');
		/*
		 * $('.other-stores-txt').removeClass('greenTab fontWhite');
		 * $('.other-stores-txt').addClass('fontGreen');
		 * $('.srch-rslt-txt').removeClass('fontGreen');
		 * $('.srch-rslt-txt').addClass('greenTab fontWhite');
		 */
		$('.other-stores-list').hide();
		$('.srch-rslt-list').show();
	} else if (tabClicked == 'OtherStores'
			|| tabClicked == 'AdvancedOtherStores') {
		$('.greenSep-left').css('visibility', 'hidden');
		$('.greenSep-right').css('visibility', 'visible');
		/*
		 * $('.srch-rslt-txt').removeClass('greenTab fontWhite');
		 * $('.srch-rslt-txt').addClass('fontGreen');
		 * $('.other-stores-txt').removeClass('fontGreen');
		 * $('.other-stores-txt').addClass('greenTab fontWhite');
		 */
		$('.srch-rslt-list').hide();
		$('.other-stores-list').show();
	}
	if (tabClicked != '' && tabClicked != 'AdvancedOtherStores'
			&& tabClicked != 'AdvancedSearchResults') {
		searchTerm = searchTerm + " | " + tabClicked;
	}
	console.log('Displaying search results : ', searchTerm);
	var searchResults = wool.query("LookupDB", {
		SearchTerm : searchTerm
	});
	if (searchResults.length == 0) {
		console.log('Search results length 0');
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
		$('#content #itemList .srch-rslt-list').html(errMsg);
	} else {
		console.log('Populating search results : ', searchTerm,
				' tabClicked : ', tabClicked);
		var nonRangedDOM = '';
		var rangedDOM = '';
		for ( var i = 0; i < (searchResults.length); i++) {
			var ranged = searchResults[i].Ranged;
			var description = searchResults[i].Description;
			var articleNo = searchResults[i].Item;
			var soh = searchResults[i].SOH;
			var tab = '';
			var box = '';
			var stockText = '';
			if (soh > 0) {
				tab = 'ranged-tab';
				box = 'ranged-box';
				stockText = 'In Stock';
			} else {
				tab = 'non-ranged-tab';
				box = 'non-ranged-box';
				stockText = 'Not in Stock';
			}
			console.log('Ranged : ', ranged, 'Description : ', description,
					' Item : ', articleNo, ' SOH : ', soh);
			if (ranged == 'Y') {
				rangedDOM = rangedDOM
				+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-list">'
				+'  <div class="list-count">'+(i+1)+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-stock-info in-stock">'
					  +'Out of Stock (30)'
					+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 item-name">'
					  +articleNo+' - '+description
					+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 store-name">'
					  +'Aisle 6'
					+'</div>'
				+'</div>'
				
			} else /* if(ranged=='N') */{
				nonRangedDOM = nonRangedDOM
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-list">'
				+'  <div class="list-count">'+(i+1)+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-stock-info in-stock">'
					  +'Out of Stock (30)'
					+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 item-name">'
					  +articleNo+' - '+description
					+'</div>'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 store-name">'
					  +'Aisle 6'
					+'</div>'
				+'</div>';
			}
			console.log('Ranged length : ', rangedDOM.length);
			console.log('Non - Ranged length : ', nonRangedDOM.length);
		}
		if (tabClicked == 'SearchResults') {
			if (rangedDOM.length == 0) {
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
				$('.search-results-content').html(errMsg);
			} else {
				$('.search-results-content').append(rangedDOM);
			}
		} else if (tabClicked == 'OtherStores') {
			if (nonRangedDOM.length == 0) {
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
				$('.search-results-content').html(errMsg);
			} else {
				$('.search-results-content').append(nonRangedDOM);
			}
		} else if (tabClicked == 'AdvancedOtherStores') {
			if (nonRangedDOM.length == 0) {
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
				$('.search-results-content').html(errMsg);
			} else {
				$('.search-results-content').append(nonRangedDOM);
			}
		} else {
			if (rangedDOM.length == 0) {
				var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
				$('.search-results-content').html(errMsg);
			} else
				$('.search-results-content').append(rangedDOM);
		}
		
		console.log('More Items available : ',
				localStorage['moreItemsAvailable']);
		if (localStorage['moreItemsAvailable'] == 'yes') {

			var moreLoader = '<div class="more-loader fontWhite txtCenter" onclick="$(\'.overlay, .loader\').fadeIn(300);centerAlign(\'.loader\');loadMoreItems();">Load more items</div><input type="hidden" class="pageNumber" value="1">';
			$('#content #itemList .srch-rslt-list').append(moreLoader);
			setTimeout(function() {
				if (document.readyState === 'complete') {
					setHeight();
					refreshScroll();
				}
			}, 300);
		}
	}
	
    if (typeof prevPage != 'undefined') {
        if (prevPage == 'stockAdjust' || prevPage == 'createOrder') {
        	console.log('binding to stock page');
            clickStockAdjust();
        }
    } else {
    	console.log('binding to details page');
        bindCLickEvent();
    }
myScroll.refresh();
	$('.overlay, .loader').fadeOut(300);
	if (document.readyState === 'complete') {
		//setHeight();
		myScroll.refresh();
	}
}

function bindCLickEvent() {
	$('.lukup-lst-itm').bind(
			'click',
			function() {
				localStorage['typeOfInput'] = 'article';
				var ranged = $(this).find('#rangedFlag').val();
				var articleNumberSelected = $(this).find('.articleNo').text();
				console.log('Selected Article : ', articleNumberSelected,
						' ranged : ', ranged);
				/*
				 * if(ranged=='true'){ localStorage['rangedItem']='true';
				 */
				localStorage['fromXtoDetails'] = 'LookupList';
				localStorage["pageId"] = 'LookupDetails';
				window.location = 'LookupDetails.html?articleNumber='
						+ articleNumberSelected;
				/*
				 * }else if(ranged=='false'){
				 * localStorage['rangedItem']='false';
				 * localStorage['articleNumberSelected']=articleNumberSelected;
				 * localStorage["pageId"] = 'addnlItemDetails'; window.location =
				 * 'addnlItemDetails.html?articleNumber='+
				 * articleNumberSelected; }
				 */
			});
}

// ------------------LookUp ends----------------------

// ------------------StockAdjust starts----------------------
function insertItemDetails(item, desc, adj, soh, reason, uom) {
	localStorage.flag = "true";
	wool.insertOrUpdate("WoolworthsDB", {
		Item : item
	}, {
		Item : item,
		Description : desc,
		Adjustment : adj,
		SOH : soh,
		Reason : reason,
		Uom : uom
	});
	wool.commit();
}
function dropAllTables() {
	dropTableFromDB("WoolworthsDB");

}
function retrieveItemData(queryStr) {
	return getTableData("WoolworthsDB", queryStr);
}
function getItemDetails() {
	ItemDet = retrieveItemData();
	setTimeout(function() {
		populateDetails();
	}, 100);
	if (document.readyState === 'complete') {
		setHeight();
		refreshScroll();
	}
}

function populateDetails() {
	for ( var i = 0; i < (ItemDet.length); i++) {
		tableRow = '<tr><td>' + ItemDet[i].Item + '</td><td>'
				+ ItemDet[i].Description + '</td><td>' + ItemDet[i].Adjustment
				+ '</td><td>' + ItemDet[i].SOH + '</td><td>'
				+ ItemDet[i].Reason
				+ '</td><td><input type="hidden" id="uom" value="'
				+ ItemDet[i].Uom + '"></td></tr>';
		$('.adj-list-table tbody').append(tableRow);
		setHeight();
		refreshScroll();

	}

}

function clearItems() {
	wool.deleteRows("WoolworthsDB");
	wool.commit();
}
function getTableData(tableName, whereClause) {
	if (whereClause === "")
		return wool.query(tableName);
	else
		return wool.query(tableName, whereClause);
}

// ----------------------StockAdjust--------------------

// ----------------------createOrder Starts--------------------
function populateVendorTable() {
	var vendorList = wool.query('vendorTable');
	for ( var i = 0; i < (vendorList.length); i++) {
		var vendor = vendorList[i].Vendor;
		var itemNo = vendorList[i].Item;
		var desc = vendorList[i].Description;
		var qty = vendorList[i].Qty;
		var soh = vendorList[i].SOH;
		var rosterDate = vendorList[i].RosterDate;
		var delDate = vendorList[i].DeliveryDate;
		var uom = vendorList[i].UOM;
		var om = vendorList[i].OM;
		// alert('om'+om);
		var ddFormat = new Date(delDateFormatted);
		// alert('ddFormat'+ddFormat);
		var day = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ][ddFormat
				.getDay()];
		// alert('day'+day);
		var month = ddFormat.getDate();
		// alert('month'+month);
		var year = ddFormat.getMonth() + 1;
		// alert('year'+year);
		ddFormat = day + ' ' + month + '/' + year;

		// Check if the vendor exist in table
		var tableLen = $('.vendor-details td').length;
		isTableExist = false;
		var elem = '';
		if (tableLen > 0) {
			$('.vendor-details').each(function() {
				var oldVendor = $(this).text();
				if (oldVendor == vendor) {
					isTableExist = true;
					elem = $(this);
					return elem;
				}

			});

			if (isTableExist) { // Vendor Exist
				var newRow = '<tr class="txtCenter fontDG table-content"><td class="itemNo">'
						+ itemNo
						+ '</td><td class="desc">'
						+ desc
						+ '</td><td class="delDate">'
						+ ddFormat
						+ '</td><td class="qty">'
						+ qty
						+ '('
						+ om
						+ uom
						+ ')</td><td class="soh">'
						+ soh
						+ '</td><td class="hiddenValues"><input type="hidden" class="roster-date" value='
						+ rosterDate
						+ '>'
						+ '<input type="hidden" class="delivery-date" value='
						+ delDate
						+ '>'
						+ '<input type="hidden" class="uom" value='
						+ uom
						+ '></td></tr>';
				elem.closest('tbody').append(newRow);
			} else {
				var newTable = '<div class="order-items-list"><table id="order-items-table" class="fontHel font14 fullWidth borderCol adj-list-table borderB txtCenter fontDG">'
						+ '<tbody><tr class="vendor-details bold borderB fontG txtLft height25"><td colspan="5" class="padL10 vendor">'
						+ vendor
						+ '</td></tr><tr class="bold table-head txtCenter fontG"><td class="itemNo">Item # '
						+ '</td><td class="desc">Desc </td><td class="delDate">DelDate</td><td class="qty">Qty(OM)</td>'
						+ '<td class="soh">SOH </td></tr><tr class="txtCenter fontDG table-content"><td class="itemNo">'
						+ itemNo
						+ '</td><td class="desc">'
						+ desc
						+ '</td><td class="delDate">'
						+ ddFormat
						+ '</td><td class="qty">'
						+ qty
						+ '('
						+ om
						+ uom
						+ ')</td><td class="soh">'
						+ soh
						+ '</td><td class="hiddenValues"><input type="hidden" class="roster-date" value='
						+ rosterDate
						+ '>'
						+ '<input type="hidden" class="delivery-date" value='
						+ delDate
						+ '>'
						+ '<input type="hidden" class="uom" value='
						+ uom
						+ '></td></tr></tbody></table></div>';
				$('.vendor-list').append(newTable);
			}

		} else {
			var newTable = '<div class="order-items-list"><table id="order-items-table" class="fontHel font14 fullWidth borderCol adj-list-table borderB txtCenter fontDG">'
					+ '<tbody><tr class="vendor-details bold borderB fontG txtLft height25"><td colspan="5" class="padL10 vendor">'
					+ vendor
					+ '</td></tr><tr class="bold table-head txtCenter fontG"><td class="itemNo">Item # '
					+ '</td><td class="desc">Desc </td><td class="delDate">DelDate</td><td class="qty">Qty(OM)</td>'
					+ '<td class="soh">SOH </td></tr><tr class="txtCenter fontDG table-content"><td class="itemNo">'
					+ itemNo
					+ '</td><td class="desc">'
					+ desc
					+ '</td><td class="delDate">'
					+ ddFormat
					+ '</td><td class="qty">'
					+ qty
					+ '('
					+ om
					+ uom
					+ ')</td><td class="soh">'
					+ soh
					+ '</td><td class="hiddenValues"><input type="hidden" class="roster-date" value='
					+ rosterDate
					+ '>'
					+ '<input type="hidden" class="delivery-date" value='
					+ delDate
					+ '>'
					+ '<input type="hidden" class="uom" value='
					+ uom + '></td></tr></tbody></table></div>';
			$('.vendor-list').append(newTable);
		}

	}
}

function clearOrders() {
	var pageID = localStorage['pageId'];
	if (pageID == "createOrder") {
		console.log('Clearing vendor table.');
		wool.deleteRows("vendorTable");
	}
	if (pageID == "ibt") {
		console.log('Clearing IBT table.');
		wool.dropTable("ibtTable");
	}
	wool.commit();
	localStorage['selectedVendor_createOrder'] = '';
	localStorage['selectedSite_IBT'] = '';
}

// ----------------------createOrder Ends--------------------
// ----------------------viewOrderDetails Starts--------------------

function insertIntoViewOrderDetailsTable(orderNo, orderType, vendor,
		tradingDept, temperature, cartonsNo, invoiceNo, invoiceTotal, gst,
		deliveryDocNo, sendingStore, receivingStore, value) {
	console.log('Inserting into viewOrderDetails: ', orderNo, orderType,
			vendor, tradingDept, temperature, cartonsNo, invoiceNo,
			invoiceTotal, gst, deliveryDocNo, sendingStore, receivingStore,
			value);
	wool.insertOrUpdate("viewOrderDetails", {
		OrderNo : orderNo
	}, {
		OrderNo : orderNo,
		OrderType : orderType,
		Vendor : vendor,
		TradingDept : tradingDept,
		Temperature : temperature,
		CartonsNo : cartonsNo,
		InvoiceNo : invoiceNo,
		InvoiceTotal : invoiceTotal,
		Gst : gst,
		DeliveryDocNo : deliveryDocNo,
		SendingStore : sendingStore,
		ReceivingStore : receivingStore,
		Value : value
	});
	wool.commit();
	console.log('INSERTED : OrderType  --> ', orderType);
}

function insertIntoViewOrderDetailItemsTable(orderNo, receivedFlag, article,
		itemNo, itemDesc, packSize, orderedQty, receivedQty) {
	console.log('Inserting into viewOrderDetailItems: ', orderNo, receivedFlag,
			article, itemNo, itemDesc, packSize, orderedQty, receivedQty);
	var orderArticleNo = orderNo + '|' + article;
	wool.insertOrUpdate("viewOrderDetailItems", {
		OrderArticleNo : orderArticleNo
	}, {
		OrderArticleNo : orderArticleNo,
		OrderNo : orderNo,
		ReceivedFlag : receivedFlag,
		Article : article,
		ItemNo : itemNo,
		ItemDesc : itemDesc,
		PackSize : packSize,
		OrderedQty : orderedQty,
		ReceivedQty : receivedQty
	});
	wool.commit();
	var itemsSearchResults = wool.query("viewOrderDetailItems", {
		OrderNo : orderNo
	});
	console.log(itemsSearchResults);
}

function displayViewOrderDetails(orderNumber) {
		var orderType = localStorage['orderType'];
		orderListDetails(orderNumber, orderType);
	

	refreshScroll();
	$(".overlay,.loader").fadeOut();
}
// ----------------------viewOrderDetails Ends--------------------

// ----------------------createOrder starts--------------------

function findOrderSearchTerm(searchKey) {
	console.log('Finding searchKey : ', searchKey);
	var tableName = 'ArticleSearchResults';
	if (wool.tableExists(tableName)) {
		var isFound = wool.query(tableName, {
			SearchKey : searchKey
		});
		console.log('TABLE : ', tableName, isFound);
		if (isFound.length > 0) {
			return true;
		} else {
			console.log(searchKey, ' not found');
			return false;
		}
	} else {
		console.log('ArticleSearchResults is not initialised');
		return false;
	}
}

function insertIntoArticleSearchresults(searchKey, searchTerm, itemNo,
		description, soh, om, baseQty, unitPrice, sos, vendorNo, vendorName, purchasePrice, department) {
	console.log('In insertIntoArticleSearchresults : ', department);
	wool.insert("ArticleSearchResults", {
		SearchKey : searchKey, 
		SearchTerm : searchTerm,
		ItemNo : itemNo,
		Description : description,
		Soh : soh,
		Om : om,
		BaseQty : baseQty,
		UnitPrice : unitPrice,
		Sos: sos,
		VendorNo : vendorNo,
		VendorName : vendorName,
		PurchasePrice : purchasePrice,
		Department: department
	});
	wool.commit();
}

function displayOrderArticles(searchKey) {
	var orderType = localStorage['previousPage'];
	console.log('orderType : ', orderType);
	if (orderType == 'createOrder') {
		tableName = 'ArticleSearchResults';
	} else if (orderType == 'ibt') {
		tableName = 'IBTSearchResults';
	}
	console.log('tableName : ', tableName);
	var searchResults = wool.query(tableName, {
		SearchKey : searchKey
	});
	if (searchResults.length == 0) {
		console.log('Search results length 0');
		var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
		$('#content .article-wrapper').html(errMsg);
	} else {
		var DOM = '';
		for ( var i = 0; i < searchResults.length; i++) {
			var description = toProperCase(searchResults[i].Description);
			var articleNo = searchResults[i].ItemNo;
			var soh = searchResults[i].Soh;
			var om = searchResults[i].Om;
			var baseQty = searchResults[i].BaseQty;
			var promoFrom = searchResults[i].PromoFrom;
			var promoTo = searchResults[i].PromoTo;
			var nextDelDate = searchResults[i].NextDelDate;
			var nextOrdQty = searchResults[i].NextOrdQty;
			var unitPrice = searchResults[i].UnitPrice;
			var variableDOM = '';
			if (tableName == 'IBTSearchResults') {
				var siteNo = searchResults[i].SiteNo;
				var siteName = searchResults[i].SiteName;
				variableDOM = '<input type="hidden" value="' + siteNo
						+ '" id ="vendorNo"  />'
						+ '<input type="hidden" value="' + siteName
						+ '" id ="vendorName"  />';
			} else if (tableName = 'ArticleSearchResults') {
				var vendorNo = searchResults[i].VendorNo;
				var vendorName = searchResults[i].VendorName;
				variableDOM = '<input type="hidden" value="' + vendorNo
						+ '" id ="vendorNo"  />'
						+ '<input type="hidden" value="' + vendorName
						+ '" id ="vendorName"  />';
			}

			console.log('Description : ', description, ' Item : ', articleNo);
			DOM = DOM
					+ '<table class="lukup-lst-itm fullWidth fontHel boderSep borderB padL10 borderSpT5"><tbody><tr>'
					+ '<td class="fontG bold txtRight width45">Item No :</td><td class="fontDG articleNo">'
					+ articleNo
					+ '</td></tr><tr><td class="fontG bold txtRight width45">Description :</td>'
					+ '<td class="fontDG description">' + description
					+ '</td></tr>' + '<tr><td>'
					+ '<input type="hidden" value="' + soh + '" id ="soh"  />'
					+ '<input type="hidden" value="' + om + '" id ="om"  />'
					+ '<input type="hidden" value="' + baseQty
					+ '" id ="baseQty"  />' + '<input type="hidden" value="'
					+ promoFrom + '" id ="promoFrom"  />'
					+ '<input type="hidden" value="' + promoTo
					+ '" id ="promoTo"  />' + '<input type="hidden" value="'
					+ nextDelDate + '" id ="nextDelDate"  />'
					+ '<input type="hidden" value="' + nextOrdQty
					+ '" id ="nextOrdQty"  />' + '<input type="hidden" value="'
					+ unitPrice + '" id ="unitPrice"  />' + variableDOM
					+ '</td></tr>' + '</tbody></table>';
		}
		$('#content .article-wrapper').append(DOM);
		clickOrderArticle();
	}
	if (document.readyState === 'complete') {
		setHeight();
		refreshScroll();
	}
}
function clickOrderArticle() {
	$('.article-wrapper .lukup-lst-itm').bind('click', function() {
		var itemNo_OQ = $(this).find('.articleNo').text();
		var desc_OQ = $(this).find('.description').text();
		console.log(itemNo_OQ, ' | ', desc_OQ);
		$('#search-input-barcode').val(itemNo_OQ + ' | ' + desc_OQ);
		var soh_OQ = $(this).find('#soh').val();
		var om_OQ = $(this).find('#om').val();
		var baseQty_OQ = $(this).find('#baseQty').val();
		var promoFrom_OQ = $(this).find('#promoFrom').val();
		var promoTo_OQ = $(this).find('#promoTo').val();
		var nextDelDate_OQ = $(this).find('#nextDelDate').val();
		var nextOrdQty_OQ = $(this).find('#nextOrdQty_OQ').val();
		var unitPrice_OQ = $(this).find('#unitPrice').val();
		var vendorName_OQ = '';
		var vendorNo_OQ = '';
		if (orderType == 'createOrder') {
			vendorName_OQ = $(this).find('#vendorName').val();
			vendorNo_OQ = $(this).find('#vendorNo').val();
		} else if (orderType == 'ibt') {
			vendorName_OQ = $(this).find('#vendorName').val();
			vendorNo_OQ = $(this).find('#vendorNo').val();
		}
		if (vendorName_OQ == 'null') {
			vendorName_OQ = '';
		}
		if (vendorNo_OQ == 'null') {
			vendorNo_OQ = '';
		}

		var oqObj = {
			'vendorNo' : vendorNo_OQ,
			'vendorName' : vendorName_OQ,
			'itemNo' : itemNo_OQ,
			'itemDesc' : desc_OQ,
			'soh' : soh_OQ,
			'om' : om_OQ,
			'baseQty' : baseQty_OQ,
			'promoFrom' : promoFrom_OQ,
			'promoTo' : promoTo_OQ,
			'nextDelDate' : nextDelDate_OQ,
			'nextOrdQty' : nextOrdQty_OQ,
			'unitPrice' : unitPrice_OQ
		};
		localStorage['orderQtyValues'] = JSON.stringify(oqObj);
		console.log('Passing to orderQuantity page' + JSON.stringify(oqObj));
		localStorage["pageId"] = 'orderQuantity';
		window.location = 'orderQuantity.html';
	});
}
// ----------------------createOrder Ends--------------------
function refreshScroll(){
	setTimeout(function () {
		myScroll.refresh();

	}, 400);
}



