import { SVGProps } from 'react';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> {
  /**
   * The size of the icon (width and height)
   * @default 24
   */
  size?: number | string;
  
  /**
   * The color of the icon (replaces fill and stroke colors)
   * @default 'white'
   */
  color?: string;
  
  /**
   * Additional CSS class name
   */
  className?: string;
}
