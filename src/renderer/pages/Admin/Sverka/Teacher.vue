<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "naive-ui";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import UsersService from "../../../services/users.service";
import CourseService from "../../../services/course.service";

import { useReportData } from "../../../stores/report";

//// report variables
const reportAct = useReportData();
const notification = useNotification();
const findRole = ref(localStorage.getItem("role"));
const router = useRouter();

const filterOptions = ref({
  filial_id: JSON.parse(localStorage.getItem("filial_id")),
  course_id: null,
  teacher_id: null,
  type:null,
  role:'Teacher'
})

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
const teacherOptions = ref([]);
const courseOptions = ref([]);

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

const getAllCourse = ()=>{
  CourseService.getAll(filterOptions.value).then((res)=>{
    courseOptions.value = res;
  })
}

const getAllTeachers = () => {
  UsersService.getAll(filterOptions.value).then((res) => {
    teacherOptions.value = res;
  });
};
const time_def = ref(new Date());
const thisMonth = ref(new Date(time_def.value.getFullYear(), time_def.value.getMonth()));
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);
///// table veribles
const loading = ref(false);
const reportData = ref([]);
const dayJS = inject("dayJS");
///// table veribles

onMounted(() => {
  getAllBranches();
  getAllTeachers();
  getAllCourse()
  if (reportAct.teacherSverka.show) {
    let el = reportAct.teacherSverka;
    range_date.value = el.range_date;
    filterOptions.value.teacher_id = el.teacher_id;
    filterOptions.value.course_id = el.course_id;
    
    showReport();
    el.show = false;
  }
});
const UpdateBranch = (branch) => {
  filterOptions.value.filial_id = branch;
  getAllTeachers();
};
const showEmpty = ref(false);
const showReport = () => {
  loading.value = true;
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    teacher_id: filterOptions.value.teacher_id,
    course_id: filterOptions.value.course_id,
    filial_id: filterOptions.value.filial_id,
    type: filterOptions.value.type
  };
  ReportService.teacherSverka(sendData).then((res) => {
    reportData.value = res;
    loading.value = false;
    if (res.data.length > 0) {
      showEmpty.value = true;
    }
  });
};

const rowProps = (row) => {
  if (row.doc_id) {
    reportAct.teacherPass = {
      id: row.doc_id,
      read: true,
    };
    router.push({ path: "/payment-teacher" });
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
  ReportService.teacherRegisterDel(id).then((res)=>{
    showReport()
  })
}
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>O'qituvchi sverka</h2>
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
              v-model:value="filterOptions.filial_id"
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
              v-model:value="filterOptions.course_id"
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
            <n-input-group-label>O'qituvchi</n-input-group-label>
            <n-select
              :options="teacherOptions"
              v-model:value="filterOptions.teacher_id"
              label-field="fullname"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item" >
          <n-input-group>
            <n-input-group-label>Turi</n-input-group-label>
            <n-select
              :options="typeOption"
              v-model:value="filterOptions.type"
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
        style="min-width: 920px"
      >
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <!-- <th>Amal</th> -->

            <th class="col-same">Sana</th>
            <th>Nomi</th>
            <th>O'qituvchi</th>
            <th>Kurs</th>
            <th>To'lov turi</th>
            <th>Izoh</th>
            <th class="color-black background-success col-same">Kirim</th>
            <th class="color-black background-error col-same">Chiqim</th>
          </tr>
        </thead>
        <tbody class="table-scroll">
          <tr>
            <td class="text-center text-bold" colspan="7">
              {{ dayJS(range_date[0]).format("YYYY-MM-DD HH:mm:ss") }}
              Boshlang'ich qoldiq
            </td>
            <td class="text-center text-bold" colspan="2">
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
                  ? "№" + item.doc_id + " " + item.doc_type
                  : item.doc_type
              }}
            </td>
            <td>{{ item.teacher ? item.teacher.fullname : "" }}</td>
            <td>{{ item.course ? item.course.name : "" }}</td>
            <td>{{ item.pay_type ? item.pay_type.name : "" }}</td>
            <td>
              {{ item.comment }}
            </td>
            <td class="text-right color-black background-success col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.kirim)
              }}
            </td>

            <td class="text-right color-black background-error col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.chiqim)
              }}
            </td>

            
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="7">Jami</td>

            <td
              class="text-right text-bold color-black background-success col-same"
            >
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_kirim ? reportData.total_kirim : 0)
              }}
            </td>

            <td
              class="text-right text-bold color-black background-error col-same"
            >
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
            <td class="text-center text-bold" colspan="7">
              {{ dayJS(range_date[1]).format("YYYY-MM-DD HH:mm:ss") }} Yakuniy
              qoldiq
            </td>
            <td class="text-center text-bold" colspan="2">
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

.report-empty {
  padding: 20px;
}
</style>
