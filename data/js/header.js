$xo(document).ready(function(){
    $xo('.loginShow').hide();
        if (loginType != 3) {
            base_m.api('get', 'API', '/api/v0/user/active', null, null, function(responseData) {
                if (responseData.results.loginType != 3) {
                    $xo('#userLogo, #mobileLoginLink').attr('xo-popover', 'menu');
                    $xo('#LOGINLINK-WD, #mobileLoginLink').removeAttr('href');
                    if (responseData.results.fName && responseData.results.fName.trim() != '') {
                        $xo('#fullName-WD, #mobileLoginBtn').text(responseData.results.fName);
                        $xo('.loginShow').show(); 
                    } else if (responseData.results.email && responseData.results.email.trim() != '') {
                        $xo('#fullName-WD, #mobileLoginBtn').text(responseData.results.email);
                        $xo('.loginShow').show(); 
                    }
                } else {
                    $xo('.loginShow').hide();
                }
            });
        } else {
            $xo('.loginShow').hide();
        }
    if (loginType == 3){
        $xo('.loggedInContent').remove();
    }
    $xo('[mobile-menu]').on('click',function(){
        var choice = $xo(this).attr('mobile-menu');
        $xo('mobile-menu').attr('status',choice);
        if (choice == 'show' && loginType != 3){
            if (loginType == 5) {
                base_m.api('get','API','/api/v0/user/active',null,null,function(responseData)
                {
                    $xo('mobile-menu tab[data="Account Data"] tab-content a').attr('href','/Page-UserSettings?type=customer&userID='+ responseData.results.loggedInCustomerID);
                });
            } else {
                $xo('mobile-menu tab[data="Account Data"] tab-content a').attr('href','/Page-AccountsAndContacts');
            }
            if (readCookie('customerID') != null) {
                $xo('mobile-menu tab[data="Wishlists"]').removeClass('hidden');
                base_m.api('get','API','/api/v0/order?CustomerID='+ readCookie('customerID') +'&InvoiceStatusID=7,8&fields=InvDesc,InvoiceID,InvoiceStatusID,InvoiceStatus.InvStatusDesc',null,null,function(responseData) {
                    $xo('mobile-menu .dynamicWishlists').empty();
                    $xo.each(responseData.results,function(key,value)
                    {
                        $xo('mobile-menu .dynamicWishlists').append('<a href="/wishlist?wishlistID='+ value.InvoiceID +'"><mobile-link invoice="'+ value.InvoiceID +'"><span>'+ value.InvDesc +'</span> (#'+ value.InvoiceID +')</mobile-link></a>');
                    });
                });
            } else {
                $xo('mobile-menu tab[data="Wishlists"]').addClass('hidden');
            }
        }
    });
    $xo('mobile-return-button').on('click',function() {
        $xo('mobile-menu slider-group.active').addClass('closing');
        $xo('mobile-menu slider-group[data="menu"]').addClass('active opening');
        $xo('mobile-menu mobile-return-button').removeClass('active');
        $xo('mobile-menu mobile-header-text').text(''); 
        setTimeout(function() {
            $xo('slider-group.opening').removeClass('opening');
            $xo('slider-group.closing').removeClass('closing active');
        },250);
    });
    $xo('slider-button[data]').on('click',function() {
        var choice = $xo(this).attr('data');
        $xo(this).closest('slider-group').addClass('closing').siblings('slider-group[data="'+ choice +'"]').addClass('active opening');
        $xo('mobile-menu mobile-return-button').addClass('active');
        $xo('mobile-menu mobile-header-text').text(choice);
        setTimeout(function() {
            $xo('slider-group.opening').removeClass('opening');
            $xo('slider-group.closing').removeClass('closing active');
        },250);
    });
    $xo('mobile-menu').on('click','[action="create wishlist"]',function() {
        var params = {
            AccountID: readCookie('accountID'),
            CustomerID: readCookie('customerID'),
            InvoiceStatusID: '7',
            InvDesc: 'New Wishlist',
        }
        var customer_m = new CustomerModel(params['CustomerID']);
        customer_m.add_invoice(params,function(data) {
            window.location = '/wishlist?wishlistID='+ data +'&new=1'
        });
    });
});
$xo(document).ready(function() {
    var lastScrollTop = $xo(window).scrollTop();
    var headerHeight = $xo('.header').height();
    var topBannerHeight = $xo('.topBanner-WD').outerHeight();
    var scrollThreshold = 120; // Adjust this value to control when the header disappears

    $xo('.topBanner-WD').css({
      'margin-bottom': headerHeight
    });

    document.documentElement.style.setProperty('--banner-height', ' ' + topBannerHeight + 'px');

    if (lastScrollTop === 0) {
      $xo('.header').addClass('atTop');
    }

    $xo(window).scroll(function() {
      var currentScroll = $xo(this).scrollTop();

      if (currentScroll === 0) {
        $xo('.header').addClass('atTop');
        $xo('.header').removeClass('fixed');
      } else if (currentScroll > lastScrollTop) {
        // Scroll down, hide sticky header only if scrolled past the threshold
        if (currentScroll > scrollThreshold) {
          $xo('.header').removeClass('fixed');
          $xo('.header').removeClass('atTop');
        }
      } else {
        // Scroll up, show sticky header
        $xo('.header').addClass('fixed');
        $xo('.header').removeClass('atTop');
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
});