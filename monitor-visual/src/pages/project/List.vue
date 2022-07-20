<template>
  <div class="page-content">
    <Button type="primary" @click="modalVisible = true">新增项目</Button>
    <div class="table-wrap">
      <Table :columns="columns"></Table>
    </div>
    <Modal
      v-model="modalVisible"
      width="600"
      @on-cancel="
        modalVisible = false
        currentProject = {}
      "
      @on-ok="handleAddProject()"
      :title="
        currentProject.projectId
          ? currentProject.projectName || '项目编辑'
          : '新增项目'
      "
    >
      <Form
        :model="currentProject"
        :label-width="80"
        ref="currentProject"
        :rules="ruleValidate"
      >
        <FormItem label="项目ID" prop="projectId">
          <Input v-model="currentProject.projectId">
            <template slot="append">
              <Button type="primary" @click="generateProjectId()"
                >随机生成</Button
              >
            </template></Input
          >
        </FormItem>
        <FormItem label="项目名称" prop="projectName">
          <Input v-model="currentProject.projectName"></Input>
        </FormItem>
        <FormItem label="项目代码">
          <Input
            v-model="currentProject.projectCode"
            type="textarea"
            :rows="10"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { guid } from '@/utils'
const genMonitorCode = (projectId) => {
  return `let monitor = new Monitor()
monitor.init({
router,
config: {
  vpt: 10
},
extendData: {
  userInfo: {},
  projectId: ${projectId}
},
// 使用此钩子函数发送数据
vptHanlder: (val) => {
  if (val.length == 10) {
    //TODO
  }
}
})
`
}
import Monitor from '@/api/monitor'
export default {
  data() {
    return {
      columns: [
        {
          title: '项目ID'
        },
        {
          title: '项目名称'
        },
        {
          title: '项目代码'
        },
        {
          title: '操作'
        }
      ],
      projectList: [],
      currentProject: {
        projectId: '',
        projectName: '',
        projectCode: ''
      },
      modalVisible: false,
      ruleValidate: {
        projectId: [
          {
            required: true,
            message: 'The projectId cannot be empty',
            trigger: 'blur'
          }
        ],
        projectName: [
          {
            required: true,
            message: 'The projectName cannot be empty',
            trigger: 'blur'
          }
        ]
      }
    }
  },

  watch: {
    'currentProject.projectId': {
      handler(newVal) {
        this.currentProject.projectCode = genMonitorCode(newVal)
      }
    }
  },

  mounted() {
    //
  },

  methods: {
    getProjectPage() {
      //
    },

    generateProjectId() {
      this.currentProject.projectId = guid()
    },

    handleAddProject() {
      let params = this.currentProject
      Monitor.handleAddProject(params).then((res) => {
        this.successAlert('操作成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
