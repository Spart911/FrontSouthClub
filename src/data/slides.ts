export interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export const slides: SlideData[] = [
  {
    id: 1,
    image: '/main_images/1.webp',
    title: 'Создай уют дома',
    subtitle: 'Вдохновленно простотой и элегантностью'
  },
  {
    id: 2,
    image: '/main_images/2.webp',
    title: 'Современный дизайн',
    subtitle: 'Инновационные решения для вашего интерьера'
  },
  {
    id: 3,
    image: '/main_images/3.webp',
    title: 'Качество и стиль',
    subtitle: 'Эксклюзивные светильники для вашего дома'
  }
]; 