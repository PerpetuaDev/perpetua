import { IService } from '../../../../../util/interfaces';

const IMAGE_BASE_PATH = '../../../../../../../assets/images/';

const epoch = new Date(0);
const icon = (file: string) => ({
    id: 0, documentId: '', name: file, url: `${IMAGE_BASE_PATH}${file}`,
    createdAt: epoch, updatedAt: epoch,
});

export const ServiceData: IService[] = [
    {
        id: 1, documentId: '', slug: 'custom-software', sort_order: 1,
        title: 'service.1.title', card_description: 'service.1.description',
        explanation: '', benefits: [], card_icon: icon('service1.svg'),
    },
    {
        id: 2, documentId: '', slug: 'websites&cms', sort_order: 2,
        title: 'service.2.title', card_description: 'service.2.description',
        explanation: '', benefits: [], card_icon: icon('service2.svg'),
    },
    {
        id: 3, documentId: '', slug: 'native&web-apps', sort_order: 3,
        title: 'service.3.title', card_description: 'service.3.description',
        explanation: '', benefits: [], card_icon: icon('service3.svg'),
    },
    {
        id: 4, documentId: '', slug: 'artificial-intelligence', sort_order: 4,
        title: 'service.4.title', card_description: 'service.4.description',
        explanation: '', benefits: [], card_icon: icon('service4.svg'),
    },
    {
        id: 5, documentId: '', slug: 'hosting&cloud-services', sort_order: 5,
        title: 'service.5.title', card_description: 'service.5.description',
        explanation: '', benefits: [], card_icon: icon('service5.svg'),
    },
    {
        id: 6, documentId: '', slug: 'data&analytics', sort_order: 6,
        title: 'service.6.title', card_description: 'service.6.description',
        explanation: '', benefits: [], card_icon: icon('service6.svg'),
    },
];
