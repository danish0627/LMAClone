/* eslint-disable no-console */
/*
Created By	 : Girikon(Mukesh[STL-227])
Created On	 : 14 Oct, ‎2019
@description : This component draw pie chart based on booth detail datas.

Modification log --
Modified By	: 
*/
import { LightningElement,api,track } from 'lwc';
import {loadScript} from 'lightning/platformResourceLoader';
import chart from '@salesforce/resourceUrl/chartjs';
import {toast} from 'c/lWCUtility';
import LOCALE from '@salesforce/i18n/locale';

export default class ExpocadClickableChart extends LightningElement {
    @api chartDatas = [];
    @api child1ChartData=[];
    @api child2ChartData=[];
    @api child3ChartData=[];
    @api isResponsive=false;
    @api chartTitle='Common Chart';
    @api chartWidth='300px';
    @api chartHeight='300px';
    
    @track showParent=true;
    @track showChild1=false;
    @track showChild2=false;
    @track showChild3=false;

    myChart;
    initializeChartJS = false;
    config;

    connectedCallback(){        
        this.config = this.getConfig('pie',this.chartDatas);
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
        const self = this;
        const temp = this.template;        
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
                    const number = parseFloat(arr[arr.length-1].trim(),10);
                    const numberFormat = new Intl.NumberFormat(LOCALE, {
                        style: 'decimal',
                        maximumFractionDigits: '2'
                    });
                    arr.pop();
                    
                    if(self.showParent){
                        innerHtml += '<tr><td>' + span + arr.join(':')+': <strong>'+numberFormat.format(number) + '</strong></td></tr>';
                    }
                    else{
                        innerHtml += '<tr><td>' + span + arr.join(':') + '</td></tr>';
                    }

				});
				innerHtml += '</tbody>';

				//let tableRoot = tooltipEl.querySelector('table');
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
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            tooltipEl.classList.remove('center');
		};
    }

    //fire when user click on chart        
    parentChartClick() {
        if(this.showParent){            
            this.showParent=false;
            this.showChild1 = true;
            this.myChart.data = this.buildChartData(this.child1ChartData,'Event Area');
            this.chartTitle = 'Event Area';
        }
        else if(this.showChild1){            
            this.showChild1 = false;
            this.showChild2 = true;
            this.myChart.data = this.buildChartData(this.child2ChartData,'Event Area');
            this.chartTitle = 'Total Exhibitors';
        }
        else if(this.showChild2){            
            this.showChild2 = false;
            this.showChild3 = true;
            this.myChart.data = this.buildChartData(this.child3ChartData,'Event Area');
            this.chartTitle = 'Total Percentage';
        }
        else if(this.showChild3){
            return;
        }
        this.myChart.update();
    }


    goToBack(event){        
        if(event.target.value==='parent'){
            this.showParent=true;
            this.showChild1 = false;
            this.myChart.data = this.buildChartData(this.chartDatas,'Booth Inforamtion');
            this.chartTitle = 'Booth Inforamtion';
        }
        else if(event.target.value==='child1'){
            this.showChild2 = false;
            this.showChild1 = true;
            this.myChart.data = this.buildChartData(this.child1ChartData,'Event Area');
            this.chartTitle = 'Event Area';
        }
        else if(event.target.value==='child2'){
            this.showChild3 = false;
            this.showChild2 = true;
            this.myChart.data = this.buildChartData(this.child2ChartData,'Total Exhibitors');
            this.chartTitle = 'Total Exhibitors';
        }
        this.myChart.update();
    }

    buildChartData(chartDatas,chartTitle){        
        if(chartDatas===undefined){return {};}
        this.chartTitle = chartTitle;
		let labels = [],data=[],colors=[];
		for(let i=0;i<chartDatas.length;i++){            
            labels.push(chartDatas[i].Name);
			data.push(chartDatas[i].expr0);			
			colors.push(this.colors(i));
        }
        return {
            datasets: [
                {
                    data: data,
                    backgroundColor: colors,
                    label: chartTitle
                }
            ],
            labels: labels
        };
    }
    getConfig(chartType,chartDatas){
        //create label,bgcolor and datasets data
		if(chartDatas===undefined){return {};}
		let labels = [],data=[],colors=[];
		for(let i=0;i<chartDatas.length;i++){            
            labels.push(chartDatas[i].Name);
			data.push(chartDatas[i].expr0);			
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
             
        if (window.navigator.msSaveOrOpenBlob) {
            //window.navigator.msSaveOrOpenBlob(blob, filename);
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
    handleShowPieChartEvent(){
        this.showParent = true;
        this.initializeChartJS = false;
        this.chartDatas = JSON.parse(JSON.stringify(this.chartDatas));        
    }
}