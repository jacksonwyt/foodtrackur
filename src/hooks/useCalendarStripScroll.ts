import {useEffect, RefObject} from 'react';
import {ScrollView, Dimensions} from 'react-native';

interface UseCalendarStripScrollProps {
  scrollViewRef: RefObject<ScrollView>;
  selectedIndex: number;
  itemWidth: number;
  itemMargin: number;
}

const windowWidth = Dimensions.get('window').width;

export const useCalendarStripScroll = ({
  scrollViewRef,
  selectedIndex,
  itemWidth,
  itemMargin,
}: UseCalendarStripScrollProps) => {
  useEffect(() => {
    if (selectedIndex !== -1 && scrollViewRef.current) {
      const totalItemWidth = itemWidth + itemMargin * 2;
      const scrollToX =
        totalItemWidth * selectedIndex - windowWidth / 2 + itemWidth / 2;

      scrollViewRef.current.scrollTo({
        x: scrollToX,
        animated: true,
      });
    }
  }, [selectedIndex, scrollViewRef, itemWidth, itemMargin]); // Dependency array includes all props used
};
