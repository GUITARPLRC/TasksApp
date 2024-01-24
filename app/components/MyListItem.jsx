import React from "react"
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { View } from "react-native"
import { Button } from "../components/Button"
import { Icon } from "../components/Icon"
import { Text } from "../components/Text"
import { colors, spacing } from "../theme"

const MyListItem = ({ task, completeTask, deleteApiTask }) => {
  const isChecked = useSharedValue(task.checked ? 1 : 0)

  const handleCheck = async () => {
    await completeTask(task)
    isChecked.value = withSpring(isChecked.value ? 0 : 1)
  }

  // Grey heart
  const animatedLikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(isChecked.value, [0, 1], [1, 0], Extrapolate.EXTEND),
        },
      ],
      opacity: interpolate(isChecked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
    }
  })

  // Pink heart
  const animatedUnlikeButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isChecked.value,
        },
      ],
      opacity: isChecked.value,
    }
  })

  return (
    <View style={$itemContainer}>
      <Button
        onPress={() => handleCheck()}
        onLongPress={() => handleCheck()}
        LeftAccessory={() => (
          <>
            <Animated.View style={[$iconContainer, animatedLikeButtonStyles]}>
              <Icon
                icon="heart"
                color={colors.palette.neutral800} // dark grey
              />
            </Animated.View>
            <Animated.View style={[$iconContainer, animatedUnlikeButtonStyles]}>
              <Icon
                icon="heart"
                color={colors.palette.primary400} // pink
              />
            </Animated.View>
          </>
        )}
      >
        <Text size="xxs" weight="medium" text={task.checked ? "Done" : "Complete"} />
      </Button>
      <Button
        onPress={() => {
          deleteApiTask(task.id)
        }}
        onLongPress={() => deleteApiTask(task.id)}
        LeftAccessory={() => <Icon icon="ladybug" style={$icon} />}
      >
        <Text size="xxs" weight="medium" text={"Delete"} />
      </Button>
    </View>
  )
}

export default MyListItem

const $itemContainer = {
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  marginTop: 10,
}
const $iconContainer = {
  flexDirection: "row",
  marginEnd: spacing.sm,
}
const $icon = {
  marginRight: 10,
  width: 30,
}
