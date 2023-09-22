<template>
  <div>
    <n-form>
      <div class="top_section">
        <n-form-item label="Sana">
          <n-date-picker
            :value="form_data.created_at * 1000"
            type="datetime"
            disabled
          />
        </n-form-item>
      </div>
      <div style="margin-bottom: 10px">
        <n-button type="info" @click="addItem">
          <template #icon>
            <n-icon size="22">
              <Plus />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div>
        <table id="customers">
          <tr>
            <th>Ishchi</th>
            <th>Narxi</th>
            <th>Service</th>
            <th></th>
          </tr>

          <tr v-for="item in form_data.doc_salary_table">
            <td style="width: 220px; display: flex">
              <n-select
                v-model:value="item.worker_id"
                :options="workers"
                label-field="name"
                value-field="id"
              />
              <n-button
                @click="(showAddWorker = true), openChoosedWorker(item.id)"
                >...</n-button
              >
            </td>

            <td style="width: 200px">
              <n-input-number :format="useFormatnumber" :parse="useParsenumber" v-model:value="item.price" clearable />
            </td>

            <td style="width: 150px">
              <n-input v-model:value="item.service" type="text" />
            </td>

            <td>
              <n-button type="error" @click="removeItem(item.id)">
                <template #icon>
                  <n-icon size="22">
                    <Trash />
                  </n-icon>
                </template>
              </n-button>
            </td>
          </tr>
        </table>
      </div>

      <div class="footer" v-if="props.type !== 'sverka'">
        <n-button type="error" @click="close">Bekor qilish</n-button>
        <n-button color="#306EBF" @click="save" style="margin-left: 10px"
          >Saqlash</n-button
        >
      </div>
    </n-form>
    <n-modal v-model:show="showAddWorker" preset="card" style="width: 600px">
      <IndexWorkers
        @createMeasure="createWorker"
        @row-click="chooseWorker"
      ></IndexWorkers>
    </n-modal>
  </div>
</template>

<script setup>
import IndexWorkers from "../workers/IndexWorkers.vue";
import SalaryService from "../../../services/doc_salary.service";
import WorkerService from "../../../services/worker.service";
import { ref, onMounted } from "vue";
import { NButton, NInput, NIcon, NSelect, NInputNumber } from "naive-ui";
import { Plus, Trash } from "@vicons/tabler";
import { useFormatnumber } from "../../../composables/numberFormat.js"
import { useParsenumber } from "../../../composables/numberFormat.js"
const props = defineProps(["type", "id"]);
const emits = defineEmits("create", "update", "close");
const workers = ref([]);
const showAddWorker = ref(false);

onMounted(() => {
  if (props.type == "update" || props.type == "sverka") {
    SalaryService.getOne(props.id).then((res) => {
      form_data.value.created_at = res.created_at;
      form_data.value.doc_salary_table = res.doc_salary_table;
    });
  }
  getAllWorkers();
});

const getAllWorkers = () => {
  WorkerService.getAll().then((res) => {
    workers.value = res;
  });
};

const form_data = ref({
  created_at: Math.floor(new Date().getTime() / 1000),
  updated_at: Math.floor(new Date().getTime() / 1000),
  doc_salary_table: [],
});

const addItem = () => {
  form_data.value.doc_salary_table.push({
    id: new Date().getTime(),
    worker_id: null,
    service: "",
    price: 0,
  });
};

const removeItem = (id) => {
  const index = form_data.value.doc_salary_table.findIndex(
    (val) => val.id == id
  );
  form_data.value.doc_salary_table.splice(index, 1);
};

const close = () => {
  emits("close");
};

const save = () => {
  if (props.type == "create") {
    SalaryService.create(form_data.value).then((res) => {
      emits("create");
    });
  } else {
    SalaryService.update(props.id, form_data.value)
      .then((res) => {
        emits("update");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const chooseWorker = (row) => {
  const index = form_data.value.doc_salary_table.findIndex(
    (val) => val.id == choosed.value
  );
  form_data.value.doc_salary_table[index].worker_id = row.id;
  showAddWorker.value = false;
};

const choosed = ref(null);
const openChoosedWorker = (id) => {
  choosed.value = id;
};

const createWorker = (data) => {
  workers.value.push(data);
  const index = form_data.value.doc_salary_table.findIndex(
    (val) => val.id == choosed.value
  );
  form_data.value.doc_salary_table[index].worker_id = data.id;
  showAddWorker.value = false;
};
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.top_section {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.top_section1 {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: space-between;
}

#customers {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 8px;
}

#customers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #04aa6d;
  color: white;
}
</style>
