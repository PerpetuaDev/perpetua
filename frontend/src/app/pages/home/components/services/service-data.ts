import { IService } from '../../../../../util/interfaces';

const IMAGE_BASE_PATH = '../../../../../../../assets/images/';

const epoch = new Date(0);
const icon = (file: string, w: number, h: number) => ({
    id: 0, documentId: '', name: file, url: `${IMAGE_BASE_PATH}${file}`,
    width: w, height: h, createdAt: epoch, updatedAt: epoch,
});

export const ServiceData: IService[] = [
    {
        id: 1, documentId: '', slug: 'custom-software', sort_order: 1,
        title: 'service.1.title',
        card_description: 'service.1.description',
        explanation: '', benefits: [],
        card_icon: icon('service1.svg', 127, 78.83),
        icon_width: 127, icon_height: 78.83, icon_mobile_width: 72, icon_mobile_height: 44.69,
    },
    {
        id: 2, documentId: '', slug: 'websites&cms', sort_order: 2,
        title: 'service.2.title',
        card_description: 'service.2.description',
        explanation: '', benefits: [],
        card_icon: icon('service2.svg', 106, 89),
        icon_width: 106, icon_height: 89, icon_mobile_width: 51, icon_mobile_height: 60.45,
    },
    {
        id: 3, documentId: '', slug: 'native&web-apps', sort_order: 3,
        title: 'service.3.title',
        card_description: 'service.3.description',
        explanation: '', benefits: [],
        card_icon: icon('service3.svg', 90, 94),
        icon_width: 90, icon_height: 94, icon_mobile_width: 45, icon_mobile_height: 75.2,
    },
    {
        id: 4, documentId: '', slug: 'artificial-intelligence', sort_order: 4,
        title: 'service.4.title',
        card_description: 'service.4.description',
        explanation: '', benefits: [],
        card_icon: icon('service4.svg', 102, 102),
        icon_width: 102, icon_height: 102, icon_mobile_width: 51, icon_mobile_height: 72,
    },
    {
        id: 5, documentId: '', slug: 'hosting&cloud-services', sort_order: 5,
        title: 'service.5.title',
        card_description: 'service.5.description',
        explanation: '', benefits: [],
        card_icon: icon('service5.svg', 116, 81.46),
        icon_width: 116, icon_height: 81.46, icon_mobile_width: 61, icon_mobile_height: 50.56,
    },
    {
        id: 6, documentId: '', slug: 'data&analytics', sort_order: 6,
        title: 'service.6.title',
        card_description: 'service.6.description',
        explanation: '', benefits: [],
        card_icon: icon('service6.svg', 89.5, 86.61),
        icon_width: 89.5, icon_height: 86.61, icon_mobile_width: 44.5, icon_mobile_height: 69.68,
    },
];