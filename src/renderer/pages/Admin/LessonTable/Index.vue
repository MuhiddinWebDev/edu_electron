<script setup>
import { ref, onMounted, inject, watch } from "vue";

import ModelService from "../../../services/lesson.service";
import BranchService from "../../../services/branch.service";
import CourseService from "../../../services/course.service";
import GroupService from "../../../services/groups.service";

import AttandanceForm from "../ToAttandance/Form.vue"

import { useMagicKeys } from "@vueuse/core";
import {
  ChevronRight16Filled as rightArrow,
  ChevronLeft16Filled as leftArrow,
} from "@vicons/fluent";


const dayJS = inject("dayJS");
const today = ref(new Date());
//// to attandance value
const showCreateAttandance = ref(false);
const showUpdateAttandance = ref(false);
const tableRow = ref({})
//// to attandance value


const searchAct = ref({
  start:today.value.getTime(),
  end:today.value.getTime(),
  filial_id:JSON.parse(localStorage.getItem("filial_id")),
  course_id:null,
  group_id:null,
})

const branchOptions = ref([]);
const courseOptions = ref([]);
const groupOptions = ref([])

const loading = ref(true);
const lessonTable = ref([]);
const branchName = ref("");
const findRole = ref(localStorage.getItem("role"));


const getAll = (start,end,branch, course,group) => {
  loading.value = true;

  let lastSearch = {
    start:dayJS(start).format("YYYY-MM-DD"),
    end:dayJS(end).format("YYYY-MM-DD"),
    filial_id:branch,
    course_id:course,
    group_id:group,
  }
  ModelService.getAllTable(lastSearch).then((res) => {
    lessonTable.value = res;
    loading.value = false;
  });
};

const getAllCourse = (filial_id)=> {
  let searchData = {
    filial_id: filial_id
  }

  CourseService.searchModel(searchData).then((res)=>{
    courseOptions.value = res
  })
}

const getAllGroup = (filial_id)=>{
  let searchData = {
    filial_id: filial_id
  }
  GroupService.searchModel(searchData).then((res)=>{
    groupOptions.value = res
  })
}

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};

const findBranchName = (branch) => {
  BranchService.getOne(branch).then((res) => {
    branchName.value = res.name;
  });
};

const currentWeek = (branch) => {
  const today = new Date();

  const daysSinceMonday = today.getDay() - 1; 
  const monday = new Date(today);

  monday.setDate(today.getDate() - daysSinceMonday);

  const daysUntilSunday = 6 - daysSinceMonday;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);

  searchAct.value.start = new Date(monday).getTime();
  searchAct.value.end = new Date(sunday).getTime();
 
  getAll(monday, sunday, branch);
};

/// to attandance functions
const closeAttandance = ()=>{
  showCreateAttandance.value = false;
}

const ableToAttandance = ()=>{
  showCreateAttandance.value = false;
  getAll(searchAct.value.start, searchAct.value.end, searchAct.value.filial_id, searchAct.value.course_id ,searchAct.value.group_id);
}

const showClose = ()=>{
  showCreateAttandance.value = false;
}

const clickTableRow = (item)=>{
  tableRow.value = item;
  // if(!item.done){
  // }
  showCreateAttandance.value = true;
}
/// to attandance functions


onMounted(() => {
  currentWeek(searchAct.value.filial_id);
  findBranchName(searchAct.value.filial_id);
  getAllGroup(searchAct.value.filial_id);
  getAllCourse(searchAct.value.filial_id);
  getAllBranches();
});

///// search functions starting

const ArrowClick = (e) => {
  const startWeekDate = new Date(searchAct.value.start);
  const endWeekDate = new Date(searchAct.value.start);

  // Calculate the new start and end dates
  const newStartWeekDate = new Date(startWeekDate);
  const newEndWeekDate = new Date(endWeekDate);
  if (e == "left") {
    newStartWeekDate.setDate(newStartWeekDate.getDate() - 7);
    newEndWeekDate.setDate(newEndWeekDate.getDate() - 1);
  } else {
    newStartWeekDate.setDate(newStartWeekDate.getDate() + 7);
    newEndWeekDate.setDate(newEndWeekDate.getDate() + 13);
  }
  searchAct.value.start = newStartWeekDate.getTime();
  searchAct.value.end = newEndWeekDate.getTime();

  getAll(searchAct.value.start, searchAct.value.end, searchAct.value.filial_id);
};
const updateBranch = (branch) => {
  getAll(searchAct.value.start, searchAct.value.end, branch);
  findBranchName(branch);
};
const updateCourse = (course)=>{
  getAll(searchAct.value.start, searchAct.value.end, searchAct.value.filial_id, course, searchAct.value.group_id);

}
const updateGroup = (group)=>{
  getAll(searchAct.value.start, searchAct.value.end, searchAct.value.filial_id, searchAct.value.course_id ,group);
}
/// search keydown event start
const { arrowright, arrowleft /* keys you want to monitor */ } = useMagicKeys();
watch(arrowright, (v) => {
  if (v) {
    ArrowClick("right");
  }
});
watch(arrowleft, (v) => {
  if (v) {
    ArrowClick("left");
  }
});
//// search keydown event end
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <h2>Dars jadvali</h2>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-button @click="ArrowClick('left')" type="success">
            <template #icon>
              <n-icon>
                <leftArrow />
              </n-icon>
            </template>
          </n-button>
          <n-input-group>
            <n-input-group-label>Boshlanish sanasi</n-input-group-label>
            <n-date-picker
              :disabled="true"
              v-model:value="searchAct.start"
              :style="{ width: '100%' }"
            ></n-date-picker>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Tugash sanasi</n-input-group-label>
            <n-date-picker
              :disabled="true"
              v-model:value="searchAct.end"
              :style="{ width: '100%' }"
            ></n-date-picker>
          </n-input-group>
          <n-button @click="ArrowClick('right')" type="success">
            <template #icon>
              <n-icon>
                <rightArrow />
              </n-icon>
            </template>
          </n-button>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              v-model:value="searchAct.filial_id"
              :options="branchOptions"
              @update:value="updateBranch"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item" >
          <n-input-group>
            <n-input-group-label>Kurs</n-input-group-label>
            <n-select
              v-model:value="searchAct.course_id"
              :options="courseOptions"
              @update:value="updateCourse"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item" >
          <n-input-group>
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              v-model:value="searchAct.group_id"
              :options="groupOptions"
              @update:value="updateGroup"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <h2 style="padding: 4px 20px">{{ branchName }} dars jadvali</h2>
      </div>
    </div>
    <n-spin :show="loading">
      <div
        class="box-table"
        :class="lessonTable.length == 0 ? 'box-table_active' : ''"
      >
        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Dushanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Monday?.length ? lessonTable.Monday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Monday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            
            <template #header>
              <p>Seshanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Tuesday?.length ? lessonTable.Tuesday[0].date: null  }} </template>

            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Tuesday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Chorshanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Wednesday?.length ? lessonTable.Wednesday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Wednesday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Payshanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Thursday?.length ? lessonTable.Thursday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Thursday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Juma</p>
            </template>
            <template #header-extra> {{ lessonTable.Friday?.length ? lessonTable.Friday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Friday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Shanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Saturday?.length ? lessonTable.Saturday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Saturday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header>
              <p>Yakshanba</p>
            </template>
            <template #header-extra> {{ lessonTable.Sunday?.length ? lessonTable.Sunday[0].date: null  }} </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in lessonTable.Sunday"
              >
                <div
                  @click="clickTableRow(item)"
                  class="time-table-row"
                  :class="item.done ? 'status-success ' : 'status-warning'"
                >
                  <div class="time-table-content_title">
                    <p>
                      {{ index + 1 }}. <span>{{ item.course }}</span>
                    </p>
                    <n-tag
                      :bordered="false"
                      round
                      :color="{ color: '#2080f0', textColor: '#fff' }"
                    >
                      {{ item.group }}
                    </n-tag>
                  </div>
                  <div class="time-table-content_item">
                    <p>{{ item.room }}</p>
                    <p>/</p>
                    <p :title="item.teacher">{{ item.teacher }}</p>
                    <p>/</p>
                    <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_empty" v-if="lessonTable.length == 0">
          <n-empty description="Bu oraliqda dars jadvali mavjud emas">
          </n-empty>
        </div>
      </div>
    </n-spin>
    <n-modal
      transform-orign="center"
      v-model:show="showCreateAttandance"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 1000px; width: calc(100vw - 20px)"
        title="Davomat olish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <AttandanceForm
          @close="closeAttandance"
          @by-table="ableToAttandance"
          :table-row="tableRow"
          type="by-table"
        />
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>
.time-table-row {
  padding: 4px 8px;
  border-radius: 5px;
  transition: 0.3s;
}
.time-table-row:hover{
  background-color: cadetblue;
}
.time-table-content_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-action_item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-text {
  margin-right: 12px;
}

.header_item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.box-table_item {
  cursor: pointer;
  padding: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 7px;
}

.box-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(390px, 1fr));
  gap: 8px 12px;
  max-height: calc(100vh - 270px);
}

.box-table_active {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
