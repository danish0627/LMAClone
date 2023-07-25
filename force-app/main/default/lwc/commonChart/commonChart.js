/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh)
Created On	 : ‎July ‎22, ‎2019
@description : Generic Table Component 
               Support to display pie chart by passing data in json format

Modification log --
Modified By	: 
*/
import { LightningElement,api } from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import chart from '@salesforce/resourceUrl/chartjs';
import {toast} from 'c/lWCUtility';
import LOCALE from '@salesforce/i18n/locale';

export default class CommonChart extends LightningElement {
    @api chartDatas = [];
    
    @api chartTitle='Common Chart';
    @api chartWidth='300px';
    @api chartHeight='300px';
    @api isParentChart=false;
    @api chartType='pie';
    @api responsive=false;
    
    myChart;
    initializeChartJS = false;
    config;

    renderedCallback(){
        this.config = this.getConfig(this.chartType);
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
            toast(this,error,'error','ERROR');
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
                    
                    if(that.isParentChart===false){
                        //Format amount
                        let arr = body.toString().split(':');
                        const number = parseFloat(arr[arr.length-1].trim(),10);
                        const numberFormat = new Intl.NumberFormat(LOCALE, {
                            style: 'currency',
                            currency: 'USD',
                            currencyDisplay: 'code'
                        });
                        arr.pop();                        
                        innerHtml += '<tr><td>' + span + arr.join(':')+': '+numberFormat.format(number) + '</td></tr>';
                    }
                    else{
                        innerHtml += '<tr><td>' + span + body + '</td></tr>';
                    }
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
    getConfig(chartType){
        //create label,bgcolor and datasets data
		if(this.chartDatas===undefined){return {};}
		let labels = [],data=[],colors=[];
		for(let i=0;i<this.chartDatas.length;i++){
            if(this.chartDatas[i].Family){
                labels.push(this.chartDatas[i].Family);
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
				responsive: this.responsive,
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
        config.options.legend.labels.usePointStyle = true;
        return config;
    }
    colors(i){
        var col = ['rgb(54, 162, 235)','rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)',
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
}