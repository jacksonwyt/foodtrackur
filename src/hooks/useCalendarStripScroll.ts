import {useEffect, RefObject} from 'react';
import {ScrollView, Dimensions} from 'react-native';

interface UseCalendarStripScrollProps {
  scrollViewRef: RefObject<ScrollView>;
  selectedIndex: number;
  itemWidth: number;
  itemMargin: number;
  stripWidth: number;
}

export const useCalendarStripScroll = ({
  scrollViewRef,
  selectedIndex,
  itemWidth,
  itemMargin,
  stripWidth,
}: UseCalendarStripScrollProps) => {
  useEffect(() => {
    if (selectedIndex !== -1 && scrollViewRef.current && stripWidth > 0) {
      const totalItemWidthWithMargins = itemWidth + itemMargin * 2;
      const scrollToX =
        totalItemWidthWithMargins * selectedIndex -
        stripWidth / 2 +
        totalItemWidthWithMargins / 2;

      scrollViewRef.current.scrollTo({
        x: scrollToX,
        animated: true,
      });
    }
  }, [selectedIndex, scrollViewRef, itemWidth, itemMargin, stripWidth]);
};
