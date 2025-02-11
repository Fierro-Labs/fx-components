import {
  configureEaseInOutLayoutAnimation,
  FxBox,
  FxHeader,
  FxPressableOpacity,
  FxReanimatedBox,
  FxSafeAreaBox,
  FxSpacer,
  FxText,
} from '@functionland/component-library';
import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { UserCardCondensed } from './UserCardCondensed';
import Reanimated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { UsersCard } from '../../components/Cards/UsersCard';
import { mockFriendData, mockUserData, TUser } from '../../api/users';
import { UserHeader } from './UserHeader';
import { WalletDetails } from '../../components/WalletDetails';

const OFFSET_START = 270;
const FADE_OFFSET = 50;

export const UsersScreen = () => {
  const scrollY = useSharedValue(0);
  const [isList, setIsList] = useState<boolean>(false);
  const scrollViewRef = useRef<Reanimated.ScrollView>(null);

  const condensedHeaderPressHandler = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [OFFSET_START - FADE_OFFSET, OFFSET_START],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const onScroll = useAnimatedScrollHandler((evt) => {
    scrollY.value = evt.contentOffset.y;
  });

  useEffect(() => {
    configureEaseInOutLayoutAnimation();
  }, [isList]);

  return (
    <FxSafeAreaBox flex={1} edges={['top']}>
      <FxBox>
        <Reanimated.ScrollView
          ref={scrollViewRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <FxSpacer marginTop="16" />
          <FxBox>
            <UserHeader userData={mockUserData} />
          </FxBox>
          <FxSpacer marginTop="48" />
          <FxHeader
            title="All Friends"
            isList={isList}
            setIsList={setIsList}
            onAddPress={() => console.log('add')}
          />
          <FxSpacer marginTop="24" />
          {!isList ? (
            <UsersCard data={mockFriendData} />
          ) : (
            <>
              {mockFriendData.map((friend) => {
                return (
                  <UserCardCondensed
                    key={friend.decentralizedId}
                    marginTop="16"
                    userData={friend}
                  />
                );
              })}
            </>
          )}
        </Reanimated.ScrollView>
        <FxReanimatedBox
          backgroundColor="backgroundApp"
          paddingVertical="8"
          position="absolute"
          top={0}
          left={0}
          right={0}
          style={headerStyle}
        >
          <PrimaryUserCondensed
            userData={mockUserData}
            onPress={condensedHeaderPressHandler}
          />
        </FxReanimatedBox>
      </FxBox>
    </FxSafeAreaBox>
  );
};

type PrimaryUserCondensedProps = {
  onPress: () => void;
  userData: TUser;
};
const PrimaryUserCondensed = ({
  userData,
  onPress,
}: PrimaryUserCondensedProps) => {
  return (
    <FxPressableOpacity onPress={onPress}>
      <FxBox flexDirection="row" alignItems="center">
        <Image
          source={Number(userData.imageUrl)}
          style={styles.condensedImage}
        />
        <FxSpacer marginLeft="16" />
        <FxText variant="bodySmallRegular" color="content1">
          @{userData.username}
        </FxText>
      </FxBox>
    </FxPressableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  condensedImage: {
    width: 50,
    height: 50,
  },
});
