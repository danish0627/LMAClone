/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[STL-123])
Created On	 : 20 Sept, ‎2019
@description : This is doughnut chart and used on account detail page. This chart will show revenue based on stage and event edition

Modification log --
Modified By	: 
*/

/* eslint-disable no-console */
import { LightningElement,api,track } from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import chart from '@salesforce/resourceUrl/chartjs';
import LOCALE from '@salesforce/i18n/locale';
import CURRENCY from '@salesforce/i18n/currency';

export default class CrmChildDoughnutChart extends LightningElement {
    @api
    chartDatas = [];
    
    @api
    chartTitle='Common Chart';
    @api chartWidth='300px';
    @api chartHeight='300px';
    @api objectName;
    @api fieldName;
    @api condition;

    @api isParentChart=false;
    @api isClickable=false;
    @api isResponsive=false;

    myChart;
    initializeChartJS = false;
    config;

    renderedCallback(){
        this.config = this.getConfig('doughnut');
        if(this.initializeChartJS){
            return;
        }
        this.initializeChartJS = true;
        
        loadScript(this,chart)
        .then(()=>{            
            this.customizeToolTip();
            const contxt = this.template.querySelector("canvas.commonChart");        
            this.myChart = new window.Chart(contxt,this.config);
        })
        .catch(error => {
            console.error(error);
        })
    }
    customizeToolTip(){
        const temp = this.template;
        const that = this;
        window.Chart.defaults.global.tooltips.custom = function(tooltip) {
			// Tooltip Element
			var tooltipEl = temp.querySelector('.chartjs-tooltip');

			// Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			// Set Text
			if (tooltip.body) {
				let titleLines = tooltip.title || [];
				let bodyLines = tooltip.body.map(getBody);

				let innerHtml = '<thead>';

				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';

				bodyLines.forEach(function(body, i) {
					let colors = tooltip.labelColors[i];
					let style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px';
					let span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                
                    //Format amount
                    let arr = body.toString().split(':');                   
                    arr.pop();
                    innerHtml += '<tr><td>' + span + arr.join(':')+ '</td></tr>';
                
				});
				innerHtml += '</tbody>';
				tooltipEl.innerHTML = innerHtml;
			}

			let positionY = this._chart.canvas.offsetTop;
			let positionX = this._chart.canvas.offsetLeft;

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = positionX + tooltip.caretX + 'px';
			tooltipEl.style.top = positionY + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
			tooltipEl.style.fontSize = tooltip.bodyFontSize;
            tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
            if(that.isParentChart===false){
                tooltipEl.style.width = '320px';
            }
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            tooltipEl.classList.remove('center');

		};
    }
    //fire when user click on chart
    @track prevSelected;
    @track newSelected;
    @track doughnutChartData;
    @track showParent=true;
    chartClick() {
        
        
    }
    getConfig(chartType){
        //const that = this;
        
        //create label,bgcolor and datasets data
		if(this.chartDatas===undefined){return {};}
		let labels = [],data=[],colors=[];
		for(let i=0;i<this.chartDatas.length;i++){
            if(this.chartDatas[i].Family){
                labels.push(this.chartDatas[i].Family);
            }
            else if(this.chartDatas[i].StageName){
                
                const numberFormat = new Intl.NumberFormat(LOCALE, {
                    style: 'currency',
                    currency: CURRENCY,
                    currencyDisplay: 'symbol'
                });                
                labels.push(this.chartDatas[i].StageName+': '+numberFormat.format(this.chartDatas[i].expr0)+' '+CURRENCY);
            }
            else{
                labels.push(this.chartDatas[i].Name);
            }
            
            
			data.push(this.chartDatas[i].expr0);			
			colors.push(this.colors(i));
		}
		let config = {
			type: chartType,
			data: 
			{
				datasets: [
					{
						data: data,
						backgroundColor: colors,
						label: this.chartTitle
					}
				],
				labels: labels
			},
			options: {
				responsive: this.isResponsive,
				legend: {
					display: true,
					position:'bottom',
                    labels: {
                        usePointStyle: false
                    }
                },                
                legendCallback: function() {
                   
                },
				tooltips: {
					enabled: false,
				}
			}
		};        
        if(this.isClickable){
            config.options.hover =  {
                onHover: function(e) {
                    var point = this.getElementAtEvent(e);                        
                    if (point && point.length) {                            
                        e.target.style.cursor = 'pointer';
                    }
                    else {
                        e.target.style.cursor = 'default';
                    }
                }
            };
        }
        config.options.legend.labels.usePointStyle = true;
        return config;
    }
    colors(i){
        var col = ['#9aed8b','rgb(201, 203, 207)','rgb(54, 162, 235)','rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)',
		'rgb(75, 192, 192)','#a307bd','rgb(153, 102, 255)','rgb(166, 224, 108)','#f45b5b','rgb(201, 203, 207)'];
		if(i<=col.length){
			return col[i];
		}

		let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    handleSelect(event){    
        let downloadType = event.detail.value;
        let canvas = this.template.querySelector("canvas.commonChart");
        
        let url_base64='';
        let fileName = this.chartTitle;
        if(downloadType==='png'){
            url_base64 = canvas.toDataURL("image/png");
            fileName +='.png';
        }
        else if(downloadType==='jpg'){
            url_base64 = canvas.toDataURL("image/jpg");
            fileName +='.jpg';
        }
        else if(downloadType==='pdf'){
            url_base64 = canvas.toDataURL("application/pdf");
            fileName +='.pdf';
        }
                
        if (window.navigator.msSaveOrOpenBlob) {
        } 
        else if(url_base64!=='')
        {
            const a = document.createElement('a');
            document.body.appendChild(a);            
            a.href = url_base64;
            a.target = '_blank';
            a.download = fileName;
            a.click();
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                window.URL.revokeObjectURL(url_base64);
                document.body.removeChild(a);
            }, 0);
        }
    }
    goBack(){
        this.dispatchEvent(new CustomEvent('showpiechart'));
    }
    handleShowPieChartEvent(){
        this.showParent = true;
        this.initializeChartJS = false;
        this.chartDatas = JSON.parse(JSON.stringify(this.chartDatas));        
    }
}