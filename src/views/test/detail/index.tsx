import { Component, Vue } from 'vue-property-decorator';
import {
  Tag,
  Modal,
  Button,
  Table,
  Badge,
  Steps,
  Popover,
  Avatar,
  Radio,
} from 'ant-design-vue';
import Chart from 'chart.js';
import './index.less';

@Component({
  name: 'test',
  components: {
    'a-tag': Tag,
    'a-modal': Modal,
    'a-button': Button,
    'a-table': Table,
    'a-badge': Badge,
    'a-steps': Steps,
    'a-radio': Radio,
    'a-radio-group': Radio.Group,
    'a-step': Steps.Step,
    'a-popover': Popover,
    'a-avatar': Avatar,
  },
})
export default class Test extends Vue {
  testInfo: any;
  partResult: any;

  PieChartDom: any;

  created() {
    this.initData();
    this.$nextTick(() => {
      this.LineChart();
    });
  }

  initData() {
    const testInfo = localStorage.getItem('testInfo');
    const partResult = localStorage.getItem('partResult');
    if (testInfo) {
      this.testInfo = JSON.parse(testInfo);
    }
    if (partResult) {
      this.partResult = JSON.parse(partResult);
    }
    console.log(this.testInfo);
  }

  LineChart() {
    const labelArray: any = [];
    const dataArray: any = [];
    this.partResult.forEach((item: any) => {
      labelArray.push(item.label);
      dataArray.push(item.score);
    });
    const PieChart: any = document.getElementById('PieChart');
    const config: any = {
      type: 'radar',
      data: {
        labels: labelArray,
        datasets: [
          {
            label: '各版块得分情况',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            backgroundColor: 'transparent',
            borderColor: '#727cf5',
            data: dataArray,
          },
        ],
      },
      options: {
        //Boolean - Whether to show lines for each scale point
        scaleShowLine: true,
        //Boolean - Whether we show the angle lines out of the radar
        angleShowLineOut: true,
        //Boolean - Whether to show labels on the scale
        scaleShowLabels: true,
        // Boolean - Whether the scale should begin at zero
        scaleBeginAtZero: true,
        //String - Colour of the angle line
        angleLineColor: 'rgba(0,0,0,.1)',
        //Number - Pixel width of the angle line
        angleLineWidth: 1,
        //String - Point label font declaration
        pointLabelFontFamily: "'Arial'",
        //String - Point label font weight
        pointLabelFontStyle: 'normal',
        //Number - Point label font size in pixels
        pointLabelFontSize: 10,
        //String - Point label font colour
        pointLabelFontColor: '#666',
        //Boolean - Whether to show a dot for each point
        pointDot: true,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 3,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a colour
        datasetFill: true,
        //String - A legend template
        legendTemplate:
          '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
      },
    };
    this.PieChartDom = new Chart(PieChart.getContext('2d'), config);
  }

  render() {
    return (
      <div class='test-detail'>
        <div class='content'>
          <div class='banner'></div>
          <div class='summary'>
            {this.testInfo.avatar ? (
              <a-avatar size={'large'} src={this.testInfo.avatar} />
            ) : (
              <a-avatar size={'large'}>U</a-avatar>
            )}
            <h2 style='margin-top:20px;'>
              {this.testInfo.student_name}的答题详情与测试结果分析
            </h2>
            <div class='sub-title'>
              <span style='margin-left:10px;font-size:10px;'>
                提交时间: {this.testInfo.created_at}
              </span>
              <span style='margin-left:10px;font-size:12px;'>
                总分: {this.testInfo.allScore}
              </span>
            </div>
            <div class='graph'>
              <canvas height='300px' id='PieChart'></canvas>
            </div>
          </div>
          <div class='test-list'>
            <div class='part'>
              <div class='part-name'>板块名称</div>
              <div class='question-list'>
                <div class='question'>
                  <div class='q-title'>1.你为什么每次都迟到?</div>
                  <div class='q-content'>
                    <a-radio-group value='2'>
                      <a-radio style='radioStyle' value='1'>
                        Option A
                      </a-radio>
                      <a-radio style='radioStyle' value='2'>
                        Option B
                      </a-radio>
                      <a-radio style='radioStyle' value='3'>
                        Option C
                      </a-radio>
                      <a-radio style='radioStyle' value='4'>
                        Option D
                      </a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
