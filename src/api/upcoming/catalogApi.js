/**
 * Settings → Catalog: service categories, car brands / models, oil brands —
 * API_ENDPOINTS.xlsx rows #58–#61, #64–#65, #68–#73 (not live yet).
 * The live ones (#62 list brands, #63 add brand, #66 list models, #67 add model) are included
 * too, so the catalog has one file.
 */
import apiClient from '../apiClient';
import { callApi } from '../apiRequest';

const asList = (data) => (Array.isArray(data) ? data : data?.items || []);

/** list / create / update / remove for one catalog resource. */
function crud({ label, listPath, createPath = listPath, itemPath, toBody }) {
  return {
    async list() {
      const data = await callApi(
        `Get ${label}`,
        () => apiClient.get(listPath),
        `Failed to load ${label}`
      );
      return asList(data.data);
    },
    async create(values) {
      const data = await callApi(
        `Create ${label}`,
        () => apiClient.post(createPath, toBody(values)),
        `Failed to add to ${label}`
      );
      return data.data;
    },
    async update(id, values) {
      const data = await callApi(
        `Update ${label}`,
        () => apiClient.put(itemPath(id), toBody(values)),
        `Failed to update ${label}`
      );
      return data.data;
    },
    remove(id) {
      return callApi(
        `Delete ${label}`,
        () => apiClient.delete(itemPath(id)),
        `Failed to delete from ${label}`
      );
    },
  };
}

const trim = (value) => String(value ?? '').trim();

/** #58–#61 /Admin/service-categories — { nameEn, nameAr, icon } */
export const serviceCategories = crud({
  label: 'service categories',
  listPath: '/Admin/service-categories',
  itemPath: (id) => `/Admin/service-categories/${id}`,
  toBody: ({ nameEn, nameAr, icon }) => ({ nameEn: trim(nameEn), nameAr: trim(nameAr), icon }),
});

/** #62 (live) list, #63 (live) add, #64 edit, #65 delete — { name, icon } */
export const carBrands = crud({
  label: 'car brands',
  listPath: '/CarCatalog/car-brands',
  createPath: '/CarCatalog/brands',
  itemPath: (id) => `/CarCatalog/brands/${id}`,
  toBody: ({ name, icon }) => ({ name: trim(name), icon }),
});

/** #66 (live) list one brand's models */
export async function getCarModels(brandId) {
  const data = await callApi(
    'Get car models',
    () => apiClient.get(`/CarCatalog/car-brands/${brandId}/models`),
    'Failed to load car models'
  );
  return asList(data.data);
}

/** #67 (live) add, #68 edit, #69 delete — { name, brandId }. list(brandId) lists one brand's models. */
export const carModels = {
  ...crud({
    label: 'car models',
    listPath: '/CarCatalog/models',
    itemPath: (id) => `/CarCatalog/models/${id}`,
    toBody: ({ name, brandId }) => ({ name: trim(name), brandId: Number(brandId) }),
  }),
  // Models are listed per brand (there's no GET /CarCatalog/models)
  list: getCarModels,
};

/** #70–#73 /Admin/oil-brands — { name } */
export const oilBrands = crud({
  label: 'oil brands',
  listPath: '/Admin/oil-brands',
  itemPath: (id) => `/Admin/oil-brands/${id}`,
  toBody: ({ name }) => ({ name: trim(name) }),
});

/**
 * The Settings page's catalog rows (settingsData.js catalogSettings ids) → the right resource,
 * e.g. CATALOG_RESOURCES.serviceCategories.list().
 */
export const CATALOG_RESOURCES = {
  serviceCategories,
  carBrands,
  carModels,
  oilBrands,
};
