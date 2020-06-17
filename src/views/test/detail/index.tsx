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
  Icon,
  Radio,
  Affix,
} from 'ant-design-vue';
import Chart from 'chart.js';
import './index.less';
// @ts-ignore
import Spin from '@/components/Spin';

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
    'a-affix': Affix,
    'a-avatar': Avatar,
    'a-icon': Icon,
    Spin,
  },
})
export default class Test extends Vue {
  testInfo: any;
  partResult: any;
  PieChartDom: any;
  spinning: Boolean = true;
  questionList: Array<any> = [];
  answerArray: Array<number> = [];
  testList: Array<any> = [];
  created() {
    this.spinning = true;
    this.initData();
    this.getTestList();
    this.$nextTick(() => {
      this.LineChart();
    });
    if (this.testInfo.status === 0) {
      this.updateStatus(1);
    }
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
  }

  async getTestList() {
    await window.api
      .testDetail({ id: this.$route.query.id })
      .then((res: any) => {
        const { data, resultCode, resultMessage, answerArray } = res.data;
        this.answerArray = answerArray.split('-');
        if (resultCode === 0) {
          this.$message.success('获取试题详情成功');
          this.handleData(data);
        } else {
          this.$message.error(resultMessage);
        }
      });
    this.spinning = false;
  }

  handleData(list: any): void {
    this.questionList = [];
    for (const [key, question] of list.entries()) {
      const temp = { ...question, answer: this.answerArray[key] };
      this.questionList.push(temp);
    }
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

  getPartAnalysis(key: number) {
    const score = this.partResult[Math.floor(key / 5)].score;
    const th = Math.floor(key / 5);
    if (score < 11) {
      return this.partResult[th]['1'];
    } else if (score < 16) {
      return this.partResult[th]['2'];
    } else if (score < 21) {
      return this.partResult[th]['3'];
    } else {
      return this.partResult[th]['4'];
    }
  }

  backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateStatus(status: number) {
    window.api
      .testHandled({ id: this.$route.query.id, status })
      .then((res: any) => {
        const { resultCode, resultMessage } = res.data;
        if (resultCode === 0 && status === 2) {
          this.$message.success('处理成功');
        } else {
          this.$message.error(resultMessage);
        }
      });
  }

  render() {
    const testList = this.questionList.map((item, key) => {
      const decade = Math.floor(key / 5);
      return (
        <div class='part-list'>
          {key % 5 === 0 ? (
            <div class='part-name' index={key}>
              <a-icon type='check-square' style='margin-right:10px;' />
              板块名称:{this.partResult[Math.floor(decade)].name}
            </div>
          ) : null}
          <div class='question-list'>
            <div class='question'>
              <div class='q-title'>{`${key + 1}.${item.title}`}</div>
              <div class='q-content'>
                <a-radio-group value={item.answer}>
                  <a-radio
                    class={item.answer === 0 ? 'radio-style' : ''}
                    value='0'
                  >
                    A: {item.a_answer}
                    {` (${item.a_score}分)`}
                  </a-radio>
                  <a-radio
                    class={item.answer === 1 ? 'radio-style' : ''}
                    value='1'
                  >
                    B: {item.b_answer}
                    {` (${item.b_score}分)`}
                  </a-radio>
                  <a-radio
                    class={item.answer === 2 ? 'radio-style' : ''}
                    value='2'
                  >
                    C: {item.c_answer}
                    {` (${item.c_score}分)`}
                  </a-radio>
                  <a-radio
                    class={item.answer === 3 ? 'radio-style' : ''}
                    value='3'
                  >
                    D: {item.d_answer}
                    {` (${item.d_score}分)`}
                  </a-radio>
                  <a-radio
                    class={item.answer === 4 ? 'radio-style' : ''}
                    value='4'
                  >
                    E: {item.d_answer}
                    {` (${item.e_score}分)`}
                  </a-radio>
                </a-radio-group>
              </div>
            </div>
          </div>
          {(key + 1) % 5 === 0 && key !== 0 ? (
            <div class='part-summary'>
              <div class='part-score'>
                该板块得分:{this.partResult[Math.floor(key / 5)].score}分
              </div>
              <div class='part-analysis'>
                <div>该板块结果分析:{this.getPartAnalysis(key)}</div>
              </div>
            </div>
          ) : null}
        </div>
      );
    });

    return (
      <div class='test-detail'>
        <a-affix style='position:absolute;top:400px;right:30px;'>
          <div class='button-group'>
            <a-button onClick={this.backToTop}>回到顶部</a-button>
            <a-button
              style='margin-top:10px;'
              onClick={this.updateStatus.bind(null, 2)}
            >
              标记已审阅
            </a-button>
          </div>
        </a-affix>
        <div class='content'>
          <div class='banner'></div>
          <div class='summary'>
            {this.testInfo.avatar ? (
              <a-avatar size='large' src={this.testInfo.avatar} />
            ) : (
              <a-avatar size='large' icon='user' />
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
            <spin show={this.spinning} text='正在加载试题详情' />
            <div class='part'>{testList}</div>
          </div>
        </div>
      </div>
    );
  }
}
