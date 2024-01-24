/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { DatabaseProvider } from "@nozbe/watermelondb/react"
import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"
import { Provider } from "react-redux"

import schema from "../model/schema"
import migrations from "../model/migrations"
import Task from "../model/task"
import store from "../store"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
      initialRouteName={"Home"} // @demo remove-current-line
    >
      <Stack.Screen name="Home" component={Screens.Home} />
    </Stack.Navigator>
  )
})

export const AppNavigator = observer(function AppNavigator(props) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <Provider store={store}>
        <DatabaseProvider database={database}>
          <AppStack />
        </DatabaseProvider>
      </Provider>
    </NavigationContainer>
  )
})

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations,
  // (optional database name or file system path)
  // dbName: 'myapp',
  // (recommended option, should work flawlessly out of the box on iOS. On Android,
  // additional installation steps have to be taken - disable if you run into issues...)
  jsi: true /* Platform.OS === 'ios' */,
  // (optional, but you should implement this method)
  onSetUpError: (error) => {
    console.log(`🍉🍉🍉 Watermelon: `, { error })
    // Database failed to load -- offer the user to reload the app or log out
  },
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [Task],
})
