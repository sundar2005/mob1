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

localStorage.site="1518";
var site="1518";
function prodSearchFn(pageNum){
    $('.overlay, .loader').fadeIn(300);
    var productSearchInput=localStorage['searchTerm'];
    var typeOfInput=localStorage['typeOfInput'];
    if(typeOfInput=='description'){
        
        console.log('isNotPresent');
        var site=localStorage['site'];
        productLookupUri="http://ncdlpfrasd0001:8080/ArticleSearchServices/article/search/siteNo/1518/articleNo/null/articleDesc/*"+productSearchInput+"* /gtin/null/sos/null/supplier/null/hierNode/null/ranged/Y/pageNo/"+pageNum+"/recCnt/20";
        productLookup(productLookupUri);
        
    }else if(typeOfInput=='plu'){
        checkArticleAndPlu(productSearchInput, '1');
    }else if(typeOfInput=='advanced'){
        console.log('Advanced');
        $('#header-right').show();
        if(productSearchInput.split(" | ")[2]=="false"){
            $('#tabs').show();
        }
        localStorage['AdvancedLoadedOnce']='true';
        isPresent=false;
        if(isPresent){
            console.log('isPresent');
            populateSearchResults(productSearchInput);
        }
        
        //bindCLickEvent();
        
        myScroll.refresh();
        initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
        $('.overlay, .loader').fadeOut(500);
    }
}


function productSearch(pageNum){
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
        //centerAlign('.loader');
        console.log('Local storage search term : ',localStorage['searchTerm']);
        if ($.isNumeric(productSearchInput)){
            console.log('isNumeric');
            var searchTermLength=productSearchInput.length;
            if((searchTermLength==4 || searchTermLength>6) && type!='article'){
                console.log('==4 || >6');
                if(searchTermLength==4){
                    localStorage['checkArticleAndPlu']='true';
                    console.log('==4');
                    
                    localStorage['typeOfInput']='plu';
                    localStorage['tabClicked']='';
                    localStorage['checkArticleAndPlu']='true';
                    localStorage['pluFlag']=false;
                    localStorage['articleFlag']=false;
                    localStorage['bothFlag']=false;
                    //checkArticleAndPlu(productSearchInput, '1');
                    localStorage['pageId']='LookupList';
                    window.location='ProductInfo.html';
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
                            //centerAlign('.loader');
                            productLookup(productLookupUri);
                        }
                    }else {
                        localStorage['fromXtoDetails']='Lookup';
                        localStorage["pageId"] = 'ProductInfo';
                        localStorage.detailsInput=productSearchInput;
                      
                        window.location.href = 'ProductInfo.html';
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
                    //centerAlign('.loader');
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
                    //centerAlign('.loader');
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
                    //centerAlign('.loader');
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
                    //centerAlign('.loader');
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
                    //centerAlign('.loader');
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
                    //centerAlign('.loader');
                    var searchKey=productSearchInput+" | "+store;
                    orderProductLookup(searchKey,productSearchInput, productLookupUri, previousPage, 'article', 'add');
                }else{
                    console.log('PRODUCT LOOKUP - productSearchInput : ', productSearchInput);
                    localStorage["pageId"] = 'ProductInfo';
                    localStorage['fromXtoDetails']='Lookup';
                    alert('m');
                    localStorage.detailsInput=productSearchInput;                                            window.location.href="ProductHome.html";

                }
            }
        }else{
            console.log('isNotNumeric');
            localStorage['typeOfInput']='description';
            console.log('To lookupList from productSearch()');
            localStorage['tabClicked']='SearchResults';
            productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_site eq '"+site+"' and iv_desc eq '*"+encodeURIComponent(productSearchInput)+"*' and iv_ranged  eq 'X'";
            $('.overlay, .loader').fadeIn(300);
            //centerAlign('.loader');
            localStorage['pageId']='LookupList';
            prodSearchFn(pageNum);
            //window.location = 'LookupList.html';
        }
    }else{
        if(localStorage['pageId']=='Lookup' || localStorage['pageId']=='stockLookup'){
            $('.overlay, #no-items-popup').fadeIn(300);
            //centerAlign('#no-items-popup');
        }
        var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">Please enter search term.</div>';
        $('.search-results-content').html(errMsg);
    }
}



function productLookup(productLookupUri){
    //alert(productLookupUri);
    console.log('productLookupUri : ', productLookupUri);
    var typeOfInput=localStorage['typeOfInput'];
    var tabClicked=localStorage['tabClicked'];
    var isPresent=false;
    if(typeOfInput=='description'){
        var searchKey=localStorage['searchTerm']+" | "+tabClicked;
        isPresent=false;
    }else if(typeOfInput=='advanced'){
        isPresent=false;
    }
    if(isPresent){
        console.log('isPresent');
        $('.search-results-content').html('');
        if(typeOfInput=='advanced' && tabClicked==''){
            localStorage['pageId']='LookupList';
            window.location='Lookuplist.html';
        }
        else{
            if(localStorage['pageId']=='LookupList'){
                populateSearchResults(localStorage['searchTerm']);
            }else{
                console.log('To LookUpList');
                localStorage['pageId']='LookupList';
                window.location='Lookuplist.html';
            }
        }
    }else{
        alert(typeOfInput);
        var productLookupHeader = {
            headers : oHeaders, // object that contains HTTP headers as name value pairs
            requestUri : productLookupUri, // OData endpoint URI
            method : "GET",
            timeoutMS : 200000
        };
        alert('ss');
        OData.request(productLookupHeader,
                      function (data, response){
                      
                      alert(JSON.stringify(data));
                      $('.loader,.bg-overlay').addClass('display-none');
                      localStorage.totalRecords=data.results[0].msg;
                      if(data.results[0].msg=='No Data Found.'){
                      $('.search-results-count span').text("No Article Found");
                      $('.loader,.bg-overlay').addClass('display-none');
                      $('.search-results-count').removeClass('display-none');
                      $('.advance-search-bar').addClass('display-none');
                      }
                      if(typeOfInput=='advanced'){
                      console.log(data.results.length);
                      localStorage['moreItemsAvailable']='no';
                      if(data.results.length==1 && data.results[0].msg!='No Data Found'){
                      localStorage['Advanced_Data']=JSON.stringify(data);
                      localStorage['fromXtoDetails']='Advanced';
                      localStorage['pageId']='ProductInfo';
                      window.location='ProductInfo.html';
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
                      }
                      localStorage['DOM']=DOM;
                      localStorage['pageId']='LookupList';
                      window.location='LookupList.html';
                      }else{
                      $('.loader').fadeOut(500);
                      $('.search-results-content').html('No article found for your search query').css('top','96px');
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
                      $('.search-results-content').html('');
                      var len = data.results.length;
                      console.log("Length : ", len);
                      if(len>=1){
                      localStorage['multipleFrom']='description';
                      console.log(' MSG : ', data.results[0].msg);
                      if(len==1 && data.results[0].msg=='No Data Found'){
                      alert('Length 0');
                      if(localStorage['pageId']=='LookupList'){
                      $('.overlay, .loader').fadeOut(500);
                      var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
                      $('.search-results-content').html(errMsg).css('top','96px');
                      }else{
                      $('.loader').fadeOut(500);
                      $('.overlay, #error-popup').fadeIn(300);
                      //centerAlign('#error-popup');
                      }
                      }else if (len>20) {
                      var rangedDOM='';
                      for (var i = 0; i < 20; i++) {
                      console.log(data.results[i]);
                      var ranged = data.results[i].ranged_flag;
                      var articleNo = data.results[i].article.replace(/^0+/, '');;
                      var description = data.results[i].description;
                      var vendorName = data.results[i].vendorName;
                      var soh=data.results[i].stock_on_hand.split('.')[0];
                      var tab='';
                      var box='';
                      var stockText='';
                      if(soh>0){
                      tab='ranged-tab';
                      box='ranged-box';
                      stockText='In Stock';
                      stockClass='in-stock';
                      }else{
                      tab='non-ranged-tab';
                      box='non-ranged-box';
                      stockText='Out of Stock';
                      stockClass='out-stock';
                      }
                      rangedDOM =
                      '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-list">'
                      +'  <div class="list-count">'+(localStorage.recordSeries++)+'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-stock-info '+stockClass+'">'
                      +stockText+'('+soh+')'
                      +'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 item-name">'
                      +articleNo+' - '+description
                      +'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 store-name">'
                      +vendorName
                      +'</div>'
                      +'</div>';
                      var searchKey=localStorage['searchTerm']+" | "+tabClicked;
                      //insertSearchResult(searchKey, articleNo, description, ranged, soh);
                      localStorage['moreItemsAvailable']='yes';
                      alert(rangedDOM);
                      $('.search-results-content').append(rangedDOM);
                      if(typeof prevPage!='undefined'){
                      if(prevPage=='stockAdjust'){
                      clickStockAdjust();
                      }
                      }else{
                      //bindCLickEvent();
                      }
                      //setHeight();
                      myScroll.refresh();
                      initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
                      }
                      var moreLoader='<div class="more-loader fontWhite txtCenter" onclick="$(\'.overlay, .loader\').fadeIn(300);centerAlign(\'.loader\');loadMoreItems();">Load more items</div><input type="hidden" class="pageNumber" value="1">';
                      $('.search-results-content').append(moreLoader);
                      //setHeight();
                      myScroll.refresh();
                      initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
                      $('.overlay, .loader').fadeOut(500);
                      }else{
                      var rangedDOM='';
                      for (var i = 0; i < data.results.length; i++) {
                      console.log(data.results[i]);
                      var ranged = data.results[i].ranged_flag;
                      var articleNo = data.results[i].article.replace(/^0+/, '');;
                      var description = data.results[i].description;
                      var vendorName = data.results[i].vendorName;
                      
                      var soh=data.results[i].stock_on_hand.split('.')[0];
                      var tab='';
                      var box='';
                      var stockText='';
                      if(soh>0){
                      tab='ranged-tab';
                      box='ranged-box';
                      stockText='In Stock';
                      stockClass='in-stock';
                      }else{
                      tab='non-ranged-tab';
                      box='non-ranged-box';
                      stockText='Out of Stock';
                      stockClass='out-stock';
                      }
                      rangedDOM = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-list">'
                      +'  <div class="list-count">'+(localStorage.recordSeries++)+'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 search-stock-info '+stockClass+'">'
                      +stockText+'('+soh+')'
                      +'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 item-name">'
                      +articleNo+' - '+description
                      +'</div>'
                      +'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 store-name">'
                      +vendorName
                      +'</div>'
                      +'</div>';
                      var searchKey=localStorage['searchTerm']+" | "+tabClicked;
                      //insertSearchResult(searchKey, articleNo, description, ranged, soh);
                      localStorage['moreItemsAvailable']='no';
                      $('.search-results-content').append(rangedDOM);
                      $('.search-results-count span').text(data.results[0].msg+" Search Results");
                      $('.loader,.bg-overlay').addClass('display-none');
                      $('.search-results-count').removeClass('display-none');
                      $('.advance-search-bar').addClass('display-none');
                      if(typeof prevPage!='undefined'){
                      if(prevPage=='stockAdjust'){
                      clickStockAdjust();
                      }
                      }else{
                      //bindCLickEvent();
                      }
                      //setHeight();
                      myScroll.refresh();
                      initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
                      }
                      $('.overlay, .loader').fadeOut(500);
                      }
                      }else{
                      console.log('Length 0');
                      if(localStorage['pageId']=='LookupList'){
                      $('.overlay, .loader').fadeOut(500);
                      var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
                      $('.search-results-content').html(errMsg);
                      }else{
                      $('.loader').fadeOut(500);
                      $('.overlay, #error-popup').fadeIn(300);
                      //centerAlign('#error-popup');
                      }
                      /*var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
                       $('.search-results-content').html(errMsg);*/
                      
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
                      var vendorName = data.results[i].vendorName;
                      
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
                      //insertSearchResult(searchKey, articleNo, description, ranged, soh);
                      console.log(i);
                      $('#content #itemList .other-stores-list').append(nonRangedDOM);
                      }
                      ////insertSearchResult(localStorage['searchTerm'], articleNo, description, ranged);
                      localStorage['moreItemsAvailable']='no';
                      if(typeof prevPage!='undefined'){
                      if(prevPage=='stockAdjust'){
                      clickStockAdjust();
                      }
                      }else{
                      //bindCLickEvent();
                      }
                      //setHeight();
                      myScroll.refresh();
                      initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
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
                      //centerAlign('#error-popup');
                      }
                      }else{
                      for (var i = 0; i < data.results.length; i++) {
                      console.log(data.results[i]);
                      if(data.results[0].msg=='No Data Found'){
                      console.log('No data found');
                      $('.loader').fadeOut();
                      $('#error-popup .popup-msg').text('No data found');
                      $('#error-popup, .overlay').fadeIn(500);
                      //centerAlign('#error-popup');
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
                      //centerAlign('#not-ranged-popup');
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
                      alert('error');
                      $('.loader').fadeOut(300);
                      if(err.response.statusCode=='400'){
                      $('.overlay, .loader').fadeOut(500);
                      var errMsg = '<div class="txtCenter padB10 errMsg padT10 fontRed font16 bold" id="errNoResponse">No Items to Display</div>';
                      $('#content #itemList .other-stores-list').html(errMsg);
                      $('.search-results-content').html(errMsg);
                      }else{
                      $('#error-popup .popup-msg').text('Server not responding');
                      $('#error-popup').fadeIn(300);
                      //centerAlign('#error-popup');
                      }
                      console.log("Error! No response received.", err.message);
                      }
                      );
    }
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
                +'  <div class="list-count">'+(localStorage.recordSeries++)+'</div>'
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
                +'  <div class="list-count">'+(localStorage.recordSeries++)+'</div>'
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
                       initScrollCode= $('#scroller').css('-webkit-transform').split(',')[5].split(')')[0].trim();
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
        //bindCLickEvent();
    }
    
    $('.overlay, .loader').fadeOut(300);
    if (document.readyState === 'complete') {
        //setHeight();
        //refreshScroll();
    }
}


function articleDetails(){
    var typeOfInput=localStorage['typeOfInput'];
    var articleNumber=localStorage.detailsInput;
    setTimeout(function(){alert(articleNumber)},1000);;
    if(typeOfInput!='advanced') {
        var site='1518';
        console.log('to productLookup ', articleNumber);
        localStorage['articleNo'] = articleNumber;
        if(typeOfInput=='article'){
            //var productLookupUri=directUriPrefix+"/ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_article  eq '"+articleNumber+"' and iv_site eq '"+site+"'";
            var productLookupUri="http://ncdlpfrasd0001:8080/ArticleSearchServices/article/search/siteNo/1518/articleNo/15311/articleDesc/null/gtin/null/sos/null/supplier/null/hierNode/null/ranged/Y/pageNo/1/recCnt/20";
            
            productLookup(productLookupUri);
        }
        else if(typeOfInput=='gtin' || typeOfInput=='plu'){
            //var productLookupUri=directUriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+articleNumber+"' and iv_site eq '"+site+"'";
            var productLookupUri=uriPrefix+"ZSP_ARTICLE_SEARCH_LIST/zsp_article_search_listCollection?$filter=iv_gtin  eq '"+articleNumber+"' and iv_site eq '"+site+"'";
            
            productLookup(productLookupUri);
        }
    }else{
        console.log('Advanced');
        var data=JSON.parse(localStorage['Advanced_Data']);
        var articleNumber = data.results[0].article;
        var description = data.results[0].description;
        var rangedItem=data.results[0].ranged_flag;
        console.log('rangedItem', rangedItem);
        console.log(localStorage['rangedItem']);
        if(localStorage['rangedItem']!='false' || rangedItem!='N'){
            var stockOnHand = data.results[0].stock_on_hand;
            var stockInTransit = data.results[0].stock_in_transit;
            var stockOnOrder = data.results[0].stock_on_order;
            var salesPrice = data.results[0].sales_price;
            var promoPrice = data.results[0].promo_sales_price;
            //var promoFromDate = data.results[0].promo_from_date;
            if(promoPrice>0){
                var promoToDate = data.results[0].promo_to_date;
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
            var orderMultiple = data.results[0].ord_mul;
            var daysOnHand = data.results[0].days_on_hand;
            var mpl = data.results[0].curr_mpl;
            var shelfCapacity = data.results[0].shelf_capacity;
            var lastRecDate = data.results[0].last_del_date;
            var lastOrderedQuantity = data.results[0].last_ord_qty;
            var lastRecQuantity = data.results[0].last_rcv_qty;
            var nextDeliveryDate = data.results[0].next_del_date;
            var nextOrderedQuantity = data.results[0].next_ord_qty;
            var uom=data.results[0].base_uom;
            var unitEAN = data.results[0].ean11;
            var unitPLU = data.results[0].plu;
            var unitBrand =data.results[0].brand_name;
            var perpetualFlag = data.results[0].perpetual_flag;
            console.log( 'EAN: ', unitEAN, 'plu: ', unitPLU, 'brand: ', unitBrand, 'perpetualFlag: ', perpetualFlag );
            //if ( perpetualFlag == "" || perpetualFlag == "undefined" ) {
            //	$("#perpetual").removeClass('.perpFlag');
            //}
            //else {
            //	$("#perpetual").addClass('perpFlag');
            //}
            var sellPriceGroup = data.results[0].pl_type+' - '+data.results[0].pl_type_desc;
            var Origin = data.results[0].country_origin;
            var supplierName = data.results[0].supp_name;
            var supplierNo = data.results[0].supp_no;
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
            $('#supplyName').text(supplierName);
            $('#supplyNo').text(supplierNo);
            $('#unitEAN').text(unitEAN);
            $('#unitUOM').text(uom);
            $('#unitPLU').text(unitPLU);
            $('#unitBrand').text(unitBrand);
            $('#sell-price-group').text(sellPriceGroup);
            $('#origin').text(Origin);
            var forSaleFlag=data.results[0].for_sale_flag;
            console.log('FOR SALE FLAG : ', forSaleFlag);s
            if(forSaleFlag=='N'){
                $('.not-for-sale').show();
            }else if(forSaleFlag=='Y'){
                $('.not-for-sale').hide();
            }
            var rangedFlag = data.results[0].ranged_flag;
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
                var deleteFlag = data.results[0].delete_ind;
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
        var cpu = data.results[0].comp_price_unit;
        localStorage['cpu']=cpu;
        var ean = data.results[0].ean11;
        localStorage['ean']=ean;
        
        var department = data.results[0].department;
        var departmentName = data.results[0].dept_name;
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
        var grossProfit = data.results[0].sell_effective_gp;
        localStorage['grossProfit']=grossProfit;
        var gst = data.results[0].gst;
        localStorage['gst']=gst;
        var vendor = data.results[0].vendor_sku;
        localStorage['vendor']=vendor;
        var sourceOfSupply = data.results[0].src_of_supp;
        if(sourceOfSupply=='1'){
            sourceOfSupply='Vendor';
        }else if(sourceOfSupply=='2'){
            sourceOfSupply='Warehouse';
        }
        localStorage['sourceOfSupply']=sourceOfSupply;
        /*var supplierDesc = data.results[0].src_of_supp_desc;
         localStorage['supplierDesc']=supplierDesc;*/
        var supplierNumber=data.results[0].supp_no;
        var supplierName=data.results[0].supp_name;
        if(supplierName=='' && supplierNumber==''){
            localStorage['supplierDesc']='';
        }else if(supplierName==''){
            localStorage['supplierDesc']=supplierNumber;
        }else if(supplierNumber==''){
            localStorage['supplierDesc']=supplierName;
        }else{
            localStorage['supplierDesc']=supplierNumber+" | "+supplierName;
        }
        var perpetualFlag = data.results[0].perpetual_flag;
        localStorage['perpetualFlag']=perpetualFlag;
        var srt = data.results[0].srt;
        localStorage['srt']=srt;
        var plu = data.results[0].plu;
        localStorage['plu']=plu;
        localStorage['baseQty']=data.results[0].base_uom;
        var packBreakdownFlag=data.results[0].pack_brk_flag;
        localStorage['packBreakdownFlag']=packBreakdownFlag;
        var securityItem=data.results[0].eas_ind;
        if(securityItem.trim()==''){
            securityItem='N';
        }
        localStorage['securityItem']=securityItem;
        //if(localStorage['rangedItem']=='false'){
        fillAdditionalDetails();
        //}
    }
    //fillAdditionalDetails();
    /* function invokeScan(){
     window.open("com.scan");
     //scannedBarcode('9334892000338');
     }
     function scannedBarcode(barcode){
     //$('#search-input').val(barcode);
     lookupSearch(barcode);
     } */
    
}