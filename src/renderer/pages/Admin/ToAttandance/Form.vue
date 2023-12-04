<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import ModelService from "../../../services/attendance.service";
import GroupsService from "../../../services/groups.service";
import BranchService from "../../../services/branch.service";
import CoursesService from "../../../services/course.service";
import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import { useNotification } from "naive-ui";

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));
const notification = useNotification();
const router = useRouter();
const props = defineProps(["type", "id", "tableRow"]);
const emit = defineEmits(["close", "create", "update", "by-table"]);

const spinBtn = ref(false);
const GroupsOptions = ref([]);
const BranchOptions = ref([]);
const CoursesOptions = ref([]);

const form_data = ref({
  group_id: null,
  teacher_id: null,
  course_id: null,
  date: new Date().getTime(),
  doc_date: new Date().getTime(),
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  davomat_table: [],
  user_id: JSON.parse(localStorage.getItem("id")),
});

const rules = {};

const getAllGroups = (id) => {
  let search_data = {
    filial_id:
      findRole.value == "SuperAdmin"
        ? form_data.value.filial_id
        : findBranch.value,
    course_id: id ? id : form_data.value.course_id,
  };
  GroupsService.searchModel(search_data).then((res) => {
    GroupsOptions.value = res;
  });
};

const getAllCourses = (id) => {
  let search_data = {
    filial_id: findRole.value == "SuperAdmin" ? id : findBranch.value,
  };
  CoursesService.searchModel(search_data).then((res) => {
    CoursesOptions.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    BranchOptions.value = res;
  });
};

const notiFunc = (text) => {
  notification["warning"]({
    content: "Ogohlantirish",
    title: "Bu sana va guruh bo'yicha dars yo'q",
    content: "Iltimos boshqa guruhni tanlang !",
    duration: 2500,
    keepAliveOnHover: true,
  });
};

const allowClick = ref(null);
const tableId = ref(null);

const UpdateCourse = (id) => {
  form_data.value.course_id = id;
  getAllGroups(id);
};
const UpdateGroup = (id) => {
  form_data.value.group_id = id;
  allowClick.value = false;
  ModelService.toAttandace(form_data.value).then((res) => {
    form_data.value.davomat_table = res.davomat_table;
    form_data.value.teacher_id = res.teacher_id;
    // form_data.value.teacher_id = res.teacher_id;
    if (res.allow && res.status) {
      allowClick.value = res.allow;
    } else {
      notiFunc();
    }
  });
};

const UpdateBranch = (id) => {
  form_data.value.filial_id = id;
  getAllCourses(id);
};
onMounted(() => {
  if (props.type == "update" || props.type == "read") {
    ModelService.getOneUpdate(props.id).then((res) => {
      form_data.value = res;
      form_data.value.date = 1000 * form_data.value.date;
      allowClick.value = true;
      getAllCourses(res.filial_id);
      getAllGroups(res.course_id);
    });
  } else if (props.type == "by-table") {
    let el = props.tableRow;

    getAllCourses(el.filial_id);
    getAllGroups(el.course_id);
    form_data.value.filial_id = el.filial_id;
    form_data.value.course_id = el.course_id;
    form_data.value.group_id = el.group_id;
    form_data.value.date = new Date(`${el.date} ${el.begin_date}`).getTime();
    if (!el.done) {
      UpdateGroup(el.group_id);
    } else {
      ModelService.getTableOne(form_data.value).then((res) => {
        if (res) {
          tableId.value = res.id;
          ModelService.getOneUpdate(res.id).then((last) => {
            form_data.value = last;
            form_data.value.date = 1000 * form_data.value.date;
            allowClick.value = true;
          });
        } else {
          let fd = form_data.value;
          let jsFd = {
            filial_id: fd.filial_id,
            course_id: fd.course_id,
            group_id: fd.group_id,
          };
          localStorage.setItem("form_data", JSON.stringify(jsFd));
          notification["warning"]({
            content: "Ogohlantirish",
            title: "Davomat olish dars jadvali bo'limida olinmagan!!!",
            content: "Iltimos davomatni o'zgatirmoqchi bo'lsangiz. Davomat bo'limida amalga oshiring. ",
            duration: 2500,
            keepAliveOnHover: true,
          });
          router.push({path:'/to-attendance'});
        }
      });
    }
  }
  getAllBranches();
  getAllCourses();
});

const save = async () => {
  try {
    if (props.type == "create") {
      if (allowClick) {
        ModelService.create(form_data.value).then((res) => {
          emit("create");
        });
      } else {
        notiFunc();
      }
    } else if (props.type == "update") {
      ModelService.update(props.id, form_data.value).then((res) => {
        emit("update");
      });
    } else if (props.type == "by-table") {
      let el = props.tableRow;
      if (!el.done) {
        ModelService.create(form_data.value).then((res) => {
          emit("by-table");
        });
      } else {
        ModelService.update(tableId.value, form_data.value).then((res) => {
          emit("by-table");
        });
      }
    }
  } catch (e) {
    console.error(e.message);
  }
};

const exit = () => {
  emit("close");
};

//// render select function start
const renderGroupSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.name]
  );
};

const renderGroup = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [
          h("div", null, [option.name]),
          h("div", null, ["Filial: " + option.branch.name]),
        ]
      ),
    ]
  );
};

//// render select function end
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="12" :y-gap="2">
        <n-grid-item>
          <n-form-item :style="{ width: '100%' }" label="Sana" path="date">
            <n-date-picker
              :style="{ width: '100%' }"
              type="datetime"
              v-model:value="form_data.date"
              :disabled="
                props.type == 'update' ||
                props.type == 'read' ||
                props.type == 'by-table'
              "
            ></n-date-picker>
          </n-form-item>
        </n-grid-item>

        <n-grid-item v-if="findRole == 'SuperAdmin'">
          <n-form-item label="Filial" path="filial_id">
            <n-select
              @update:value="UpdateBranch"
              :options="BranchOptions"
              filterable
              label-field="name"
              value-field="id"
              v-model:value="form_data.filial_id"
              :disabled="
                props.type == 'update' ||
                props.type == 'read' ||
                props.type == 'by-table'
              "
            ></n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="Kurs" path="course_id">
            <n-select
              @update:value="UpdateCourse"
              :options="CoursesOptions"
              :render-label="renderGroup"
              :render-tag="renderGroupSelect"
              filterable
              label-field="name"
              value-field="id"
              v-model:value="form_data.course_id"
              :disabled="
                props.type == 'update' ||
                props.type == 'read' ||
                props.type == 'by-table'
              "
            ></n-select>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="Guruh" path="group_id">
            <n-select
              @update:value="UpdateGroup"
              :options="GroupsOptions"
              :render-label="renderGroup"
              :render-tag="renderGroupSelect"
              filterable
              label-field="name"
              value-field="id"
              v-model:value="form_data.group_id"
              :disabled="
                props.type == 'update' ||
                props.type == 'read' ||
                props.type == 'by-table'
              "
            ></n-select>
          </n-form-item>
        </n-grid-item>
      </n-grid>
      <n-divider :style="{ margin: '0px 0px 12px 0px' }">Talabalar</n-divider>
      <n-scrollbar x-scrollable>
        <n-table
          style="min-width: 620px"
          :bordered="false"
          :single-line="false"
          size="small"
        >
          <thead>
            <th>ID</th>
            <th>Talaba</th>
            <th>Kelmadi</th>
            <th>Sababli</th>
            <th>Izoh</th>
          </thead>
          <tbody v-if="allowClick">
            <tr v-for="(item, index) in form_data.davomat_table">
              <td>{{ index + 1 }}</td>
              <td>{{ item.student ? item.student.fullname : "" }}</td>
              <td class="text-center">
                <n-checkbox
                  :disabled="item.apsent_disable || props.type == 'read'"
                  size="large"
                  v-model:checked="item.apsent"
                />
              </td>
              <td class="text-center">
                <n-checkbox
                  :disabled="
                    !item.apsent || item.because_disable || props.type == 'read'
                  "
                  size="large"
                  v-model:checked="item.because"
                />
              </td>
              <td>
                <n-input
                  v-model:value="item.comment"
                  clearable
                  :disabled="props.type == 'read'"
                >
                </n-input>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-scrollbar>
      <n-divider :style="{ margin: '12px 0px' }"></n-divider>
      <n-spin :show="spinBtn" v-if="props.type != 'read'">
        <div class="btn-action">
          <n-button @click="exit" type="warning">
            <template #icon>
              <exit-icon />
            </template>
            Chiqish
          </n-button>
          <n-button @click="save" type="success">
            <template #icon>
              <n-icon>
                <save-icon />
              </n-icon>
            </template>
            Saqlash
          </n-button>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>

<style scoped>
.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>
