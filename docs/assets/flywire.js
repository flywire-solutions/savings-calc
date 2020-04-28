
var vm = new Vue({
    el: '#card',
    data: {
        ccys: currencies,

        readOnly: false,
        showCurrentConfig: false,
        showFlywireConfig: false,

        enableFlywire: false,
        showRates: true,
        showSavings: true,
        condensedView: false,
        growthRaw: 1,

        merchantName: 'The ABC Wine Co.',
        merchantLogoUrl: '',
        ccy: currencies[0],
        amountRaw: 1000000,
        numberOfTransactions: 5000,
        percentCard: 0.5,

        currentMerchantCardRate: 0.0175,
        currentMerchantCardPerTransactionAmount: 0.25,
        currentMerchantWirePerTransactionAmount: 20,

        currentPayerCardRate: 0.025,
        currentPayerWirePerTransactionAmount: 5,
        currentPayerWireRate: 0.035,

        flywireCombinedCardRate: 0.035,
        flywireCombinedWireRate: 0.02,
        flywirePercentMerchant: 0,
        flywireMerchantCardPerTransactionAmount: 0,
        flywireMerchantWirePerTransactionAmount: 0,
        flywireNumberOfDisbursements: 52,
        flywireMerchantDisbursementAmount: 0,

        flywirePayerWirePerTransactionAmount: 0,
    },
    computed: {
        growth: function() {
            return parseFloat(this.growthRaw);
        },
        amount: function() {
            return parseFloat(this.amountRaw) * this.growth;
        },
        averageAmount: function() {
            return this.amount / this.numberOfTransactions;
        },
        percentWire: {
            get: function () {
                return 1 - this.percentCard;
            },
            set: function (newValue) {
                this.percentCard = 1 - newValue;
            }
        },
        cardAmount: function() {
            return this.amount * this.percentCard;
        },
        wireAmount: function() {
            return this.amount * this.percentWire;
        },
        numberOfCardTransactions: function() {
            return this.numberOfTransactions * this.percentCard;
        },
        numberOfWireTransactions: function() {
            return this.numberOfTransactions * this.percentWire;
        },

        currentMerchantCardFees: function() {
            return (this.cardAmount * this.currentMerchantCardRate) + (this.numberOfCardTransactions * this.currentMerchantCardPerTransactionAmount);
        },
        currentMerchantWireFees: function() {
            return this.numberOfWireTransactions * this.currentMerchantWirePerTransactionAmount;
        },
        currentMerchantFees: function() {
            return this.currentMerchantCardFees + this.currentMerchantWireFees;
        },
        currentMerchantAmountReceived: function() {
            return this.amount - this.currentMerchantFees;
        },

        currentPayerCardFees: function() {
            return this.cardAmount * this.currentPayerCardRate;
        },
        currentPayerWireFees: function() {
            return (this.wireAmount * this.currentPayerWireRate) + (this.numberOfWireTransactions * this.currentPayerWirePerTransactionAmount);
        },
        currentPayerFees: function() {
            return this.currentPayerCardFees + this.currentPayerWireFees;
        },
        currentPayerAmountSent: function() {
            return this.amount + this.currentPayerFees;
        },

        currentTotalCardFees: function() {
            return this.currentMerchantCardFees + this.currentPayerCardFees;
        },
        currentTotalWireFees: function() {
            return this.currentMerchantWireFees + this.currentPayerWireFees;
        },
        currentTotalFees: function() {
            return this.currentTotalCardFees + this.currentTotalWireFees;
        },

        flywirePercentPayer: {
            get: function () {
                return 1 - this.flywirePercentMerchant;
            },
            set: function (newValue) {
                this.flywirePercentMerchant = 1 - newValue;
            }
        },
        flywireMerchantCardRate: function() {
            return this.flywireCombinedCardRate * this.flywirePercentMerchant;
        },
        flywireMerchantCardFees: function() {
            return (this.cardAmount * this.flywireMerchantCardRate) + (this.numberOfCardTransactions * this.flywireMerchantCardPerTransactionAmount);
        },
        flywireMerchantWireRate: function() {
            return this.flywireCombinedWireRate * this.flywirePercentMerchant;
        },
        flywireMerchantWireFees: function() {
            return (this.wireAmount * this.flywireMerchantWireRate) + this.numberOfWireTransactions * this.flywireMerchantWirePerTransactionAmount;
        },
        flywireMerchantFees: function() {
            return this.flywireMerchantCardFees + this.flywireMerchantWireFees;
        },
        flywireDisbursementFees: function() {
            return this.flywireNumberOfDisbursements * this.flywireMerchantDisbursementAmount;
        },
        flywireMerchantAmountReceived: function() {
            return this.amount - (this.flywireMerchantFees + this.flywireDisbursementFees);
        },

        flywirePayerCardRate: function() {
            return this.flywireCombinedCardRate * this.flywirePercentPayer;
        },
        flywirePayerCardFees: function() {
            return this.cardAmount * this.flywirePayerCardRate;
        },
        flywirePayerWireRate: function() {
            return this.flywireCombinedWireRate * this.flywirePercentPayer;
        },
        flywirePayerWireFees: function() {
            return (this.wireAmount * this.flywirePayerWireRate) + (this.numberOfWireTransactions * this.flywirePayerWirePerTransactionAmount);
        },
        flywirePayerFees: function() {
            return this.flywirePayerCardFees + this.flywirePayerWireFees;
        },
        flywirePayerAmountSent: function() {
            return this.amount + this.flywirePayerFees;
        },

        flywireTotalCardFees: function() {
            return this.flywireMerchantCardFees + this.flywirePayerCardFees;
        },
        flywireTotalWireFees: function() {
            return this.flywireMerchantWireFees + this.flywirePayerWireFees;
        },
        flywireTotalFees: function() {
            return this.flywireTotalCardFees + this.flywireTotalWireFees;
        },

        flywireMerchantSaving: function() {
            return this.currentMerchantFees - this.flywireMerchantFees;
        },
        flywirePayerSaving: function() {
            return this.currentPayerFees - this.flywirePayerFees;
        },
        flywireTotalSaving: function() {
            return this.flywireMerchantSaving + this.flywirePayerSaving;
        }
    },
    created: function () {
        this.load();
    },
    methods: {
        load: function () {
            this.readOnly =    parseInt(this.getQueryStringValue('ro') || '0') == 1;

            this.enableFlywire =    parseInt(this.getQueryStringValue('ef') || '0') == 1;
            this.showRates =        parseInt(this.getQueryStringValue('sr') || '1') == 1;
            this.showSavings =      parseInt(this.getQueryStringValue('ss') || '1') == 1;
            this.condensedView =    parseInt(this.getQueryStringValue('cv') || '0') == 1;
            this.growthRaw =        parseFloat(this.getQueryStringValue('g') || '1');

            this.merchantName =         decodeURIComponent(this.getQueryStringValue('mn') || 'The ABC Wine Company');
            this.merchantLogoUrl =      decodeURIComponent(this.getQueryStringValue('ml') || '');
            this.ccy =                  this.getCurrency(this.getQueryStringValue('ccy') || 'USD');
            this.amountRaw =            parseFloat(this.getQueryStringValue('a') || '1000000');
            this.numberOfTransactions = parseInt(this.getQueryStringValue('not') || '1000');
            this.percentCard =          parseFloat(this.getQueryStringValue('pc') || '0.5');

            this.currentMerchantCardRate =                 parseFloat(this.getQueryStringValue('cmcr') || '0.0175');
            this.currentMerchantCardPerTransactionAmount = parseFloat(this.getQueryStringValue('cmcpta') || '0.25');
            this.currentMerchantWirePerTransactionAmount = parseFloat(this.getQueryStringValue('cmwpta') || '20');

            this.currentPayerCardRate =                 parseFloat(this.getQueryStringValue('cpcr') || '0.025');
            this.currentPayerWirePerTransactionAmount = parseFloat(this.getQueryStringValue('cpwpta') || '5');
            this.currentPayerWireRate =                 parseFloat(this.getQueryStringValue('cpwr') || '0.035');

            this.flywireCombinedCardRate =                 parseFloat(this.getQueryStringValue('fccr') || '0.035');
            this.flywireCombinedWireRate =                 parseFloat(this.getQueryStringValue('fcwr') || '0.02');
            this.flywirePercentMerchant =                  parseFloat(this.getQueryStringValue('fpm') || '0');
            this.flywireMerchantCardPerTransactionAmount = parseFloat(this.getQueryStringValue('fmcpta') || '0');
            this.flywireMerchantWirePerTransactionAmount = parseFloat(this.getQueryStringValue('fmwpta') || '0');
            this.flywireNumberOfDisbursements =            parseInt(this.getQueryStringValue('fnod') || '52');
            this.flywireMerchantDisbursementAmount =       parseFloat(this.getQueryStringValue('fmda') || '0');

            this.flywirePayerWirePerTransactionAmount =    parseFloat(this.getQueryStringValue('fpwpta') || '0');

            var title = 'Flywire Savings | ' + this.merchantName;
            document.title = title;
        },
        save: function() {
            var queryString = 
                '?ef=' + (this.enableFlywire ? 1 : 0) +
                '&sr=' + (this.showRates ? 1 : 0) +
                '&ss=' + (this.showSavings ? 1 : 0) +
                '&cv=' + (this.condensedView ? 1 : 0 )+
                '&g=' + this.growthRaw +

                '&mn=' + encodeURIComponent(this.merchantName) +
                '&ml=' + encodeURIComponent(this.merchantLogoUrl) +
                '&ccy=' + this.ccy.code +
                '&a=' + this.amountRaw +
                '&not=' + this.numberOfTransactions +
                '&pc=' + this.percentCard +

                '&cmcr=' + this.currentMerchantCardRate +
                '&cmcpta=' + this.currentMerchantCardPerTransactionAmount +
                '&cmwpta=' + this.currentMerchantWirePerTransactionAmount +

                '&cpcr=' + this.currentPayerCardRate +
                '&cpwpta=' + this.currentPayerWirePerTransactionAmount +
                '&cpwr=' + this.currentPayerWireRate +

                '&fccr=' + this.flywireCombinedCardRate +
                '&fcwr=' + this.flywireCombinedWireRate +
                '&fpm=' + this.flywirePercentMerchant +
                '&fmcpta=' + this.flywireMerchantCardPerTransactionAmount +
                '&fmwpta=' + this.flywireMerchantWirePerTransactionAmount +
                '&fnod=' + this.flywireNumberOfDisbursements +
                '&fmda=' + this.flywireMerchantDisbursementAmount +

                '&fpwpta=' + this.flywirePayerWirePerTransactionAmount;

            var url = window.location.href.split('?')[0] + queryString;
            var title = 'Flywire Savings | ' + this.merchantName;

            window.history.pushState(null, title, url);
            document.title = title;
            this.copyLink(url);

            M.toast({html: 'URL updated and copied to the Clipboard.<br/>(press Ctrl-D to bookmark)' });
        },
        clear: function() {
            var url = window.location.href.split('?')[0];
            window.history.pushState(null, null, url);

            this.load();
            M.toast({html: 'Figures reset to default values.' });
        },
        getQueryStringValue: function (key) {
            return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
        },
        getCurrency: function (code) {
            return currencies.find(function(elem) {
                return elem.code == code;
            });
        },
         copyLink: function(url) {
            var tempElement = document.createElement('textarea');
            tempElement.value = url;
            tempElement.setAttribute('readonly', '');
            tempElement.style = { position: 'absolute', left: '-9999px' };
            document.body.appendChild(tempElement);
            tempElement.select();
            document.execCommand('copy');
            document.body.removeChild(tempElement);
        }
    },
    filters: {
        currency: function(value, ccy, condensedView) {
            if (!value) {
                return ccy + '0';
            }

            var val = parseFloat(value);
            var suffix = '';
            var dps = 0;

            if (val < 1) {
                dps = 2;
            }
            else if (condensedView) {
                dps = 1;
                if (val >= 1000000) {
                    val = val / 1000000;
                    suffix = 'M'
                }
                else if (val >= 10000) {
                    val = val / 1000;
                    suffix = 'k';
                } 
                else {
                    dps = 0;
                }
            }

            return ccy + val.toLocaleString(undefined, { minimumFractionDigits:dps, maximumFractionDigits: dps }) + suffix;
        },
        percent: function(value, dps) {
            dps = dps || 2;
            return ((value * 100).toLocaleString(undefined, { maximumFractionDigits: dps})) + '%';
        }
    }
});