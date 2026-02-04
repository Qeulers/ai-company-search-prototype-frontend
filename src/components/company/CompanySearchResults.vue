<script setup>
import { ref } from "vue";
import ConfidenceBadge from "../common/ConfidenceBadge.vue";
import DepartmentCard from "./DepartmentCard.vue";
import AddressMap from "./AddressMap.vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  personaDisplay: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["close"]);

const showExportMenu = ref(false);
const showAllAlternativeContacts = ref(false);

const relevantDepartments =
  props.data.departments?.filter((d) =>
    props.data.persona_relevant_departments?.includes(d.name),
  ) || [];

const otherDepartments =
  props.data.departments?.filter(
    (d) => !props.data.persona_relevant_departments?.includes(d.name),
  ) || [];

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportVCard = () => {
  const d = props.data;
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
  vcard += `FN:${d.company_name}\n`;
  vcard += `ORG:${d.company_name}\n`;
  if (d.main_phone) vcard += `TEL;TYPE=WORK,VOICE:${d.main_phone}\n`;
  if (d.headquarters_address)
    vcard += `ADR;TYPE=WORK:;;${d.headquarters_address.replace(/,/g, ";")}\n`;
  if (d.website) vcard += `URL:${d.website}\n`;

  d.departments?.forEach((dept) => {
    if (dept.email) vcard += `EMAIL;TYPE=WORK:${dept.email}\n`;
    if (dept.phone) vcard += `TEL;TYPE=WORK:${dept.phone}\n`;
  });

  vcard += "END:VCARD";

  const filename = `${d.company_name.replace(/[^a-z0-9]/gi, "_")}.vcf`;
  downloadFile(vcard, filename, "text/vcard");
  showExportMenu.value = false;
};

const exportCSV = () => {
  const d = props.data;
  const rows = [];

  rows.push(["Type", "Name", "Phone", "Email", "Address", "Website"]);
  rows.push([
    "Company",
    d.company_name,
    d.main_phone || "",
    "",
    d.headquarters_address || "",
    d.website || "",
  ]);

  d.departments?.forEach((dept) => {
    rows.push([
      "Department",
      dept.name,
      dept.phone || "",
      dept.email || "",
      "",
      "",
    ]);
  });

  d.alternative_contacts?.forEach((ac) => {
    rows.push([
      ac.type,
      ac.location || "",
      ac.phone || "",
      ac.email || "",
      ac.address || "",
      "",
    ]);
  });

  const csvContent = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");

  const filename = `${d.company_name.replace(/[^a-z0-9]/gi, "_")}.csv`;
  downloadFile(csvContent, filename, "text/csv");
  showExportMenu.value = false;
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div
        class="p-6 border-b border-slate-200 flex items-start justify-between"
      >
        <div>
          <h2 class="text-xl font-semibold text-brand-dark">
            {{ data.company_name }}
          </h2>
          <div class="mt-2 flex items-center gap-3">
            <ConfidenceBadge :level="data.confidence_level" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div v-if="!data.no_results" class="relative">
            <button
              @click="showExportMenu = !showExportMenu"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="showExportMenu"
              class="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10"
            >
              <button
                @click="exportVCard"
                class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                vCard (.vcf)
              </button>
              <button
                @click="exportCSV"
                class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                CSV (.csv)
              </button>
            </div>
          </div>
          <button
            @click="emit('close')"
            class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              class="h-5 w-5 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div v-if="data.no_results" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="mt-4 text-slate-600">
            No reliable results found for this company
          </p>
          <p class="mt-1 text-sm text-slate-500">
            Please verify via official sources
          </p>
        </div>

        <template v-else>
          <div
            v-if="personaDisplay && relevantDepartments.length > 0"
            class="bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <p class="text-sm text-primary-700 font-medium mb-3">
              Based on your profile as a <strong>{{ personaDisplay }}</strong
              >, these are the most relevant contacts:
            </p>
            <div class="space-y-3">
              <DepartmentCard
                v-for="dept in relevantDepartments"
                :key="dept.name"
                :department="dept"
                highlighted
              />
            </div>
          </div>

          <div class="space-y-4">
            <div v-if="data.website" class="flex items-center gap-3">
              <svg
                class="h-5 w-5 text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <a
                :href="data.website"
                target="_blank"
                rel="noopener"
                class="text-primary hover:underline"
              >
                {{ data.website }}
              </a>
            </div>

            <div v-if="data.headquarters_address" class="space-y-0">
              <div class="flex items-start gap-3">
                <svg
                  class="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span class="text-slate-700">{{
                  data.headquarters_address
                }}</span>
              </div>
              <AddressMap :address="data.headquarters_address" />
            </div>

            <div v-if="data.main_phone" class="flex items-center gap-3">
              <svg
                class="h-5 w-5 text-slate-400 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span class="text-slate-700">{{ data.main_phone }}</span>
            </div>
          </div>

          <div v-if="otherDepartments.length > 0">
            <h4
              class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3"
            >
              {{
                relevantDepartments.length > 0
                  ? "Other Contacts"
                  : "Department Contacts"
              }}
            </h4>
            <div class="space-y-3">
              <DepartmentCard
                v-for="dept in otherDepartments"
                :key="dept.name"
                :department="dept"
              />
            </div>
          </div>

          <div v-if="data.alternative_contacts?.length > 0">
            <h4
              class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3"
            >
              Alternative Contacts
            </h4>
            <div
              :class="[
                'space-y-2',
                showAllAlternativeContacts &&
                data.alternative_contacts.length > 3
                  ? 'max-h-48 overflow-y-auto pr-2'
                  : '',
              ]"
            >
              <div
                v-for="(contact, index) in showAllAlternativeContacts
                  ? data.alternative_contacts
                  : data.alternative_contacts.slice(0, 3)"
                :key="index"
                class="bg-slate-50 rounded-lg border border-slate-200 p-3"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <span
                      class="text-xs font-medium text-slate-500 uppercase"
                      >{{ contact.type }}</span
                    >
                    <p
                      v-if="contact.location"
                      class="text-sm font-medium text-brand-dark"
                    >
                      {{ contact.location }}
                    </p>
                  </div>
                </div>
                <div class="mt-2 space-y-1">
                  <div
                    v-if="contact.phone"
                    class="flex items-center gap-2 text-sm"
                  >
                    <svg
                      class="h-3.5 w-3.5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span class="text-slate-700">{{ contact.phone }}</span>
                  </div>
                  <div
                    v-if="contact.email"
                    class="flex items-center gap-2 text-sm"
                  >
                    <svg
                      class="h-3.5 w-3.5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      :href="`mailto:${contact.email}`"
                      class="text-primary hover:underline"
                    >
                      {{ contact.email }}
                    </a>
                  </div>
                  <div
                    v-if="contact.address"
                    class="flex items-start gap-2 text-sm"
                  >
                    <svg
                      class="h-3.5 w-3.5 text-slate-400 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="text-slate-600">{{ contact.address }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              v-if="data.alternative_contacts.length > 3"
              @click="showAllAlternativeContacts = !showAllAlternativeContacts"
              class="mt-2 text-sm text-primary hover:underline"
            >
              {{
                showAllAlternativeContacts
                  ? "Show less"
                  : `Show ${data.alternative_contacts.length - 3} more`
              }}
            </button>
          </div>

          <div
            v-if="data.confidence_reasoning"
            class="bg-slate-50 rounded-lg p-4"
          >
            <h4 class="text-sm font-medium text-slate-700 mb-1">
              Confidence Assessment
            </h4>
            <p class="text-sm text-slate-600">
              {{ data.confidence_reasoning }}
            </p>
          </div>

          <div v-if="data.sources?.length > 0">
            <h4
              class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2"
            >
              Sources
            </h4>
            <ul class="space-y-1">
              <li
                v-for="source in data.sources"
                :key="source.url"
                class="text-sm"
              >
                <a
                  :href="source.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary hover:underline truncate block"
                >
                  {{ source.name }}
                </a>
              </li>
            </ul>
          </div>
        </template>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-amber-800 mb-1">
            AI-Generated Content Disclaimer
          </h4>
          <p class="text-sm text-amber-700">
            These results were generated using AI and web search. Information
            may be incomplete, outdated, or inaccurate. Always verify critical
            details through official company sources before making business
            decisions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
