$('.company_popup').tooltipster({
    content: 'Loading...',
    position: 'top-right',
    trigger: 'hover',
    minWidth: 250,
    maxWidth: 300,
    contentAsHTML: true,
    trigger: 'click',
    functionBefore: function (origin, continueTooltip) {

        continueTooltip();
        var companyguid = $(this).data('company'); //getter
        var turl = "/Popup/CompanyInfo.aspx?companyguid="+companyguid;

        if (origin.data('ajax') !== 'cached') {
            $.ajax({
                type: 'POST',
                url: turl,
                data: {
                    html: ' <span style="color: #f00;"> Not Loading </span>'
                },
                success: function (data) {
                    origin.tooltipster('update', data).data('ajax ', 'cached');
                }
            });

        }
    }
});
