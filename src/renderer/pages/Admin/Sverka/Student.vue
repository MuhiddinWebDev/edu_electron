<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "naive-ui";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import UsersService from "../../../services/users.service";
import CourseService from "../../../services/course.service";
import GroupService from "../../../services/groups.service"

import { useReportData } from "../../../stores/report";

//// report variables
const time_def = ref(new Date());
const thisMonth = ref(new Date(time_def.value.getFullYear(), time_def.value.getMonth()));
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);

const notification = useNotification();
const reportAct = useReportData();
const router = useRouter();

const filterData = ref({
  start_date: Math.floor(range_date.value[0] / 1000),
  end_date: Math.floor(range_date.value[1] / 1000),
  student_id: null,
  course_id: null,
  group_id: null,
  filial_id: JSON.parse(localStorage.getItem("filial_id")),
  type:null,
});

const filterOptions = ref({
  filial_id: filterData.value.filial_id,
  role:'User'
})

const findRole = ref(localStorage.getItem("role"));
const typeOption = ref([
  {
    type:1,
    name:'Kirim'
  },
  {
    type:0,
    name:"Chiqim"
  }
])
const branchOption = ref([]);
const studentOptions = ref([]);
const courseOptions = ref([]);
const groupOptions = ref([]);

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const getAllCourses = ()=>{
  CourseService.getAll(filterOptions.value).then((res)=>{
    courseOptions.value = res;
  })  
}
const getAllGroup = ()=>{
  GroupService.getAll(filterOptions.value).then((res)=>{
    groupOptions.value = res;
  })  
}

const getAllStudents = () => {
  UsersService.getAll(filterOptions.value).then((res) => {
    studentOptions.value = res;
  });
};

///// table veribles
const loading = ref(false);
const reportData = ref([]);
const dayJS = inject("dayJS");
///// table veribles
onMounted(() => {
  getAllBranches();
  getAllStudents();
  getAllCourses();
  getAllGroup();

  if (reportAct.studentSverka.show) {
    let el = reportAct.studentSverka;
    range_date.value = el.range_date;
    filterData.value.course_id = el.course_id;
    filterData.value.group_id = el.group_id;
    filterData.value.student_id = el.student_id;
    filterData.value.filial_id = el.filial_id;
    showReport();
    el.show = false;
  }
});
const UpdateBranch = (branch) => {
  getAllStudents(branch);
};
const showReport = () => {
  
  loading.value = true;
  filterData.value.start_date = Math.floor(range_date.value[0] / 1000);
  filterData.value.end_date = Math.floor(range_date.value[1] / 1000);
  ReportService.studentSverka(filterData.value).then((res) => {
    reportData.value = res;
    loading.value = false;
  });
};

const rowProps = (row) => {
  if (row.doc_id) {
    reportAct.studentPass = {
      id: row.doc_id,
      read: true,
    };
    router.push({ path: "/payment-students" });
  } else {
    notification.warning({
      content: "Ogohlantirish ",
      meta: row.doc_type + " yozilgan!",
      duration: 1500,
      keepAliveOnHover: true,
    });
  }
};
const DelRow = (id)=>{
  ReportService.studentRegisterDel(id).then((res)=>{
    showReport()
  })
}
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Talaba sverka</h2>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Sana</n-input-group-label>
            <n-date-picker
              v-model:value="range_date"
              type="daterange"
              :style="{ width: '100%' }"
            />
          </n-input-group>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              @update:value="UpdateBranch"
              :options="branchOption"
              v-model:value="filterData.filial_id"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Kurs</n-input-group-label>
            <n-select
              :options="courseOptions"
              v-model:value="filterData.course_id"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              :options="groupOptions"
              v-model:value="filterData.group_id"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Talaba</n-input-group-label>
            <n-select
              :options="studentOptions"
              v-model:value="filterData.student_id"
              label-field="fullname"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Turi</n-input-group-label>
            <n-select
              :options="typeOption"
              v-model:value="filterData.type"
              label-field="name"
              value-field="type"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-button @click="showReport" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-table
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1420px"
      >
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <!-- <th>Amal</th> -->
            <th class="col-same">Sana</th>
            <th>Nomi</th>
            <th>Talaba</th>
            <th>Guruh</th>
            <th>Kurs</th>
            <th>Izoh</th>
            <th>To'lov turi</th>
            <th class="color-black background-success col-same">Kirim</th>
            <th class="color-black background-warning col-same">Chegirma</th>
            <th class="color-black background-error col-same">Chiqim</th>
          </tr>
        </thead>
        <tbody class="table-scroll">
          <tr>
            <td class="text-center text-bold" colspan="8">
              Boshlang'ich qoldiq
            </td>
            <td class="text-center text-bold" colspan="3">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.begin_total ? reportData.begin_total : 0)
              }}
            </td>
          </tr>
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td class="text-center" style="width: 50px">{{ index + 1 }}</td>
            <!-- <td>
              <n-button @click="DelRow(item.id)" type="error">
                Del
              </n-button>
            </td> -->
            <td class="col-same">
              {{ dayJS(item.datetime * 1000).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>
              {{
                item.doc_id
                  ? "№ " + item.doc_id + " " + item.doc_type
                  : item.doc_type
              }}
            </td>
            <td>{{ item.user ? item.user.fullname : "" }}</td>
            <td>{{ item.group ? item.group.name : "" }}</td>
            <td>{{ item.course ? item.course.name : "" }}</td>
            <td>{{ item.comment }}</td>
            <td>{{ item.pay_type ? item.pay_type.name : "" }}</td>
            <td class="text-right color-black background-success col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.kirim ? item.kirim : 0)
              }}
            </td>
            <td class="text-right color-black background-warning col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.discount ? item.discount : 0)
              }}
            </td>
            <td class="text-right color-black background-error col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.chiqim ? item.chiqim : 0)
              }}
            </td>
            
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="8">Jami</td>

            <td class="text-right text-bold color-black background-success">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_kirim ? reportData.total_kirim : 0)
              }}
            </td>
            <td class="text-right text-bold color-black background-warning">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  reportData.total_discount ? reportData.total_discount : 0
                )
              }}
            </td>
            <td class="text-right text-bold color-black background-error">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_chiqim ? reportData.total_chiqim : 0)
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="8">Yakuniy qoldiq</td>
            <td class="text-center text-bold" colspan="3">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.end_total ? reportData.end_total : 0)
              }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<style>
.report-data-row {
  cursor: pointer;
}


</style>
