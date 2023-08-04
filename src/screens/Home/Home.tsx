import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useRewardedInterstitialAd,
} from 'react-native-google-mobile-ads';

// Hooks
import { useLoading } from '~/components/molecules/Loading';

// Styles
import {
  StBtn,
  StViewCardBtnSet,
  StFlatListFeelings,
  StTextEmotion,
  StTextMessage,
  StTextTitle,
  StView,
  StViewCardContent,
  StViewFlatListFeelingsSep,
  StViewRecordCard,
  StBtnCardBtnWrapper,
} from './Home.style';

// DB
import { useRealm } from '~/db/realm';
import { Feeling } from '~/db/realm/models';

// Types
import type { RootStackScreenProps } from '~/types/react-navigations';
type EditMode = 'modify' | 'delete' | null;

// Ads
const bannerAdUnitId = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-9480069633849139/1340536908';
const rewardAdUnitIdForEdit = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-9480069633849139/6642439827';

const Home: React.FC<RootStackScreenProps<'Home'>> = ({
  navigation: { navigate },
}) => {
  // States & Hooks
  const { show: showLoading, hide: hideLoading } = useLoading();
  const realm = useRealm();
  const [feelings, setFeelings] = React.useState<Realm.Results<Feeling>>();
  const {
    isLoaded: isLoadedRewardAdForEdit,
    isEarnedReward: isEarnedRewardRewardAdForEdit,
    isClosed: isClosedRewardAdForEdit,
    load: loadRewardAdForEdit,
    show: showRewardAdForEdit,
  } = useRewardedInterstitialAd(rewardAdUnitIdForEdit, {
    requestNonPersonalizedAdsOnly: true,
  });
  const [triggerShowRewardAdForEdit, setTriggerShowRewardAdForEdit] =
    React.useState<boolean>(false);
  const editModeRef = React.useRef<EditMode>(null);
  const editItemRef = React.useRef<Feeling | null>(null);
  const feelingAnimationFinishedCallbackRef = React.useRef<() => void>(
    () => {}
  );

  // Control Edit Button
  const onPressToEdit = React.useCallback(
    (item: Feeling, editMode: EditMode) => {
      editModeRef.current = editMode;
      editItemRef.current = item;
      if (!isLoadedRewardAdForEdit) {
        // Dependency에 의해 여러번 호출되더라도 함수 내부적으로 중복 호출을 방지하므로 걱정하지 말자
        console.log('Loading Reward Ad for Edit');
        showLoading();
        loadRewardAdForEdit();
        setTriggerShowRewardAdForEdit(true);
      }
    },
    [
      showLoading,
      isLoadedRewardAdForEdit,
      loadRewardAdForEdit,
      showRewardAdForEdit,
      setTriggerShowRewardAdForEdit,
    ]
  );

  React.useEffect(() => {
    if (isLoadedRewardAdForEdit && triggerShowRewardAdForEdit) {
      hideLoading();
      showRewardAdForEdit();
    }
  }, [
    hideLoading,
    triggerShowRewardAdForEdit,
    isLoadedRewardAdForEdit,
    showRewardAdForEdit,
  ]);

  // Layout Animation for feelings
  React.useEffect(() => {
    const feelings = realm.objects<Feeling>('Feeling');
    feelings.removeAllListeners();
    feelings.addListener((feelings, changes) => {
      LayoutAnimation.spring(() => {
        console.log('Run Layout Animation callback');
        feelingAnimationFinishedCallbackRef.current();
        feelingAnimationFinishedCallbackRef.current = () => {};
      });
      setFeelings(feelings.sorted('_id', true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, [feelingAnimationFinishedCallbackRef]);

  // Action after Rewarded Ad is Earned & Closed
  React.useEffect(() => {
    const editMode = editModeRef.current;
    const editItem = editItemRef.current;

    if (!editMode || !editItem) return;
    if (isEarnedRewardRewardAdForEdit && isClosedRewardAdForEdit) {
      console.log('Ad Rewarded & Closed:', editMode, editItem);
      if (editMode === 'modify') {
        setTriggerShowRewardAdForEdit(false);
        modifyFeelingFromRealm(editItem);
      } else if (editMode === 'delete') {
        feelingAnimationFinishedCallbackRef.current = () =>
          setTriggerShowRewardAdForEdit(false);
        deleteFeelingFromRealm(editItem);
      } else {
        console.log('Nothing to do');
      }
    }
  }, [
    isEarnedRewardRewardAdForEdit,
    isClosedRewardAdForEdit,
    setTriggerShowRewardAdForEdit,
  ]);

  // Manipulate Realm Data
  const modifyFeelingFromRealm = React.useCallback((item: Feeling) => {
    navigate('Modify', { item });
  }, []);

  const deleteFeelingFromRealm = React.useCallback((item: Feeling) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey('Feeling', item._id);
      realm.delete(feeling);
    });
  }, []);

  return (
    <StView>
      <StTextTitle>My Journal</StTextTitle>
      <BannerAd
        unitId={bannerAdUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
      <StFlatListFeelings
        ItemSeparatorComponent={StViewFlatListFeelingsSep}
        data={feelings}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <StViewRecordCard>
            <StViewCardContent>
              <StTextEmotion>{item.emotion}</StTextEmotion>
              <StTextMessage>{item.message}</StTextMessage>
            </StViewCardContent>
            <StViewCardBtnSet>
              <StBtnCardBtnWrapper
                onPress={() => onPressToEdit(item, 'modify')}
              >
                <Ionicons name="pencil" size={20} color="black" />
              </StBtnCardBtnWrapper>
              <StBtnCardBtnWrapper
                onPress={() => onPressToEdit(item, 'delete')}
              >
                <Ionicons name="trash-outline" size={20} color="black" />
              </StBtnCardBtnWrapper>
            </StViewCardBtnSet>
          </StViewRecordCard>
        )}
      />
      <StBtn onPress={() => navigate('Write')}>
        <AntDesign name="plus" size={40} color="white" />
      </StBtn>
    </StView>
  );
};

export default Home;
