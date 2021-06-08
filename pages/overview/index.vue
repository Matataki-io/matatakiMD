<template>
  <div>
    <div id="spinner-container" />
    <div id="hackmd-app">
      <div class="ui-next-container">
        <div id="sidebar" class="ui-next-sidenav">
          <div class="ui-next-sidenav-inner">
            <div class="ui-next-sidenav-workspace flex items-center sidenav-item">
              <a class="ui-next-sidenav-workspace-link ellipsis-text flex-one" title="我的空間" history="[object Object]" match="[object Object]" href="/"><div class="ui-next-sidenav-workspace-label ellipsis-text cursor-pointer"><span class="item-icon"><i class="fa fa-user fa-fw" /></span>我的空間</div></a>
              <!-- <div class="sidenav-item-action menu-component" style="width: 34px;">
                <i class="ui-menu-fa-icon fa fa-angle-down" /><div class="dismiss-overlay" style="display: none;" /><div class="menu-container base-menu position-bottom" style="display: none; top: 0px; right: 1680px; max-height: calc(100vh - 40px); margin-top: 0px; max-width: 210px;">
                  <div class="menu-item" style="padding-left: 40px;">
                    <i class="fa fa-check fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /><span class="ui-next-sidenav-workspace-item"><span class="item-icon"><i class="fa fa-user" /></span>我的空間</span>
                  </div><div class="divider" /><div class="menu-item" style="padding-left: 40px;">
                    <i class="fa fa-plus fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />建立新團隊
                  </div>
                </div>
              </div> -->
              <div class="ui-notification-menu menu-component">
                <a class="ui-notification sidenav-item-action" style="cursor: pointer;"><span class="item-icon"><i class="fa fa-fw ui-menu-fa-icon fa-bell"><div class="count small" /></i></span></a><div class="dismiss-overlay" style="display: none;" /><div class="menu-container base-menu position-right show-arrow" style="display: none; top: 22px; left: 0px; max-height: unset; margin-left: 13px; width: 440px; max-width: 100vw; bottom: 22px;">
                  <div class="arrow" style="top: 0px;" />
                  <div class="menu-body">
                    <div class="tabs-container">
                      <ul class="nav nav-tabs tablist" role="tablist">
                        <li role="presentation" class="tab">
                          <a class="tab-item" aria-controls="general" role="tab"><span class="tab-title flex items-center">一般通知</span><span><div class="tab-count small" /></span></a>
                        </li><li role="presentation" class="tab">
                          <a class="tab-item" aria-controls="important" role="tab"><span class="tab-title flex items-center">重要通知</span></a>
                        </li><li role="presentation" class="tab">
                          <a class="tab-item" aria-controls="announcement" role="tab"><span class="tab-title flex items-center">公告</span><span><div class="tab-count small" /></span></a>
                        </li>
                      </ul><a href="/settings#notification"><div class="notification-feature-button ui-notification-settings" title="" data-placement="bottom" data-original-title="通知設定"><i class="fa fa-fw fa-cog" /></div></a><div class="notification-feature-button visible-xs ui-notification-close">
                        <i class="fa fa-fw fa-times" />
                      </div>
                    </div><div class="notification-container" style="" />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="ui-next-sidenav-search sidenav-item mb-1/2">
              <select class="ui-next-sidenav-search-input selectized" placeholder="搜尋關鍵字或標籤..." tabindex="-1" style="display: none;">
                <option value="" selected="selected" />
              </select>
              <div class="selectize-control ui-next-sidenav-search-input single plugin-restore_on_focus plugin-preserve_on_blur_with_no_event">
                <div class="selectize-input items not-full has-options">
                  <input type="select-one" autocomplete="off" tabindex="0" placeholder="搜尋關鍵字或標籤..." style="width: 143.953px;">
                </div><div class="selectize-dropdown single ui-next-sidenav-search-input plugin-restore_on_focus plugin-preserve_on_blur_with_no_event" style="display: none; width: 240px; top: 36px; left: 0px;">
                  <div class="selectize-dropdown-content">
                    <div class="search-option return active" data-selectable="" data-value="">
                      <span class="query">顯示此空間的筆記</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <div class="sidenav-item ui-next-sidenav-create" style="margin-top: 40px;">
              <div class="ui-next-sidenav-create-button flex items-center">
                <a class="ui-next-sidenav-create-label" href="javascript:;" @click="handleSubmit"><i class="fa fa-plus mr-1" style="font-size: 18px;" /> 建立筆記</a>
                <!-- <div class="sidenav-item-action menu-component" style="top: 0px; right: 0px;">
                  <span class="ui-ellipsis"><svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.84978 13.3632C8.53228 13.3632 9.086 12.8083 9.086 12.1244C9.086 11.4405 8.53228 10.8856 7.84978 10.8856C7.16729 10.8856 6.61357 11.4405 6.61357 12.1244C6.61357 12.8083 7.16729 13.3632 7.84978 13.3632ZM7.84978 6.54977C7.16729 6.54977 6.61357 7.10463 6.61357 7.78853C6.61357 8.47242 7.16729 9.02728 7.84978 9.02728C8.53228 9.02728 9.086 8.47242 9.086 7.78853C9.086 7.10463 8.53228 6.54977 7.84978 6.54977ZM9.086 3.4529C9.086 4.13678 8.53228 4.69162 7.84978 4.69162C7.16729 4.69162 6.61357 4.13678 6.61357 3.4529C6.61357 2.76902 7.16729 2.21417 7.84978 2.21417C8.53228 2.21417 9.086 2.76902 9.086 3.4529Z" fill="#CBCBCB" /></svg></span><div class="dismiss-overlay" style="display: none;" /><div class="menu-container base-menu position-bottom" style="display: none; top: 0px; right: 1680px; max-height: calc(100vh - 40px); margin-top: 0px;">
                    <div class="menu-item" style="padding-left: 40px;">
                      <i class="fa fa-file-image-o fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />從範本新增筆記
                    </div><div class="menu-item" style="padding-left: 40px;">
                      <i class="fa fa-github fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />從 GitHub 匯入單檔
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="ui-next-sidenav-pages sidenav-menu" style="margin-top: 15px;">
              <ul>
                <li>
                  <a aria-current="page" class="sidenav-menu-link active" history="[object Object]" match="[object Object]" href="/overview"><span class="item-icon"><i class="fa fa-lock fa-fw" /></span> 我的筆記</a>
                </li>
                <!-- <li><a class="sidenav-menu-link" history="[object Object]" match="[object Object]" href="/?nav=collab"><span class="item-icon"><i class="fa fa-users fa-fw" /></span> 協作筆記</a></li> -->
                <li style="position: absolute; bottom: 96px; left: 0px; right: 0px; z-index: 2;">
                  <a class="sidenav-menu-link" href="javascript:;"><span class="item-icon"><i class="fa fa-bookmark fa-fw" /></span> 收藏</a>
                </li>
                <li style="position: absolute; bottom: 56px; left: 0px; right: 0px; z-index: 2;">
                  <a class="sidenav-menu-link" href="javascript:;"><span class="item-icon"><i class="fa fa-clock-o fa-fw" /></span> 最近瀏覽</a>
                </li>
              </ul>
            </div>
            <div v-if="isUser" class="ui-next-sidenav-bottom-menu">
              <div class="ui-next-sidenav-profile">
                <div class="sidenav-item-action menu-component" style="position: relative;">
                  <div class="ui-next-sidenav-profile-container">
                    <div class="ui-next-sidenav-profile-label ellipsis-text">
                      <img class="ui-avatar circle" width="22" height="22" :src="`https://ssimg.frontenduse.top/${usersData.avatar}`"><span class="ui-name">{{ usersData.nickname || usersData.username }}</span>
                    </div>
                    <div class="ui-next-sidenav-profile-button" @click="toggleUserModal = true">
                      <i class="fa fa-angle-up" />
                    </div>
                  </div>
                  <div v-show="toggleUserModal" class="dismiss-overlay" @click="toggleUserModal = false" />
                  <div v-show="toggleUserModal" class="menu-container base-menu position-top" style="transform: translate(0, calc(-100% + -46px)); left: 15px; right: 1680px; min-width: 200px;max-height: 835px;">
                    <small class="menu-title">我的帳戶</small>
                    <!-- <a href="/settings#general" style="text-decoration: none;">
                      <div class="menu-item" style="padding-left: 40px;"><i class="fa fa-cog fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />設定</div></a>
                    <a href="/@It_nJKeNS-ieRL2hcUZRTg" style="text-decoration: none;"><div class="menu-item" style="padding-left: 40px;"><i class="fa fa-user-circle-o fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />個人公開頁</div></a>
                    <a class="menu-item" history="[object Object]" match="[object Object]" href="/?nav=myTeams" style="padding: 0px;"><div class="menu-item" style="padding-left: 22px;"><img src="/images/team-icon.svg" width="14" height="14" style="margin: 0px 4px 2px 2px; vertical-align: text-bottom;">我參與的團隊</div></a>
                    <a class="menu-item" history="[object Object]" match="[object Object]" href="/?nav=billing" style="padding: 0px;"><div class="menu-item" style="padding-left: 40px;"><i class="fa fa-credit-card fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />付費</div></a> -->
                    <div class="divider" />
                    <div class="menu-item" style="padding-left: 40px;" @click="signOut">
                      <i class="fa fa-sign-out fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />登出
                    </div>
                  </div>
                </div>
              </div>
              <div class="ui-next-sidenav-help menu-component" style="position: relative;">
                <div @click="toggleHelpModal = true">
                  <span class="item-icon"> <i class="fa fa-question fa-fw" aria-hidden="true" /> </span>
                </div>
                <div v-show="toggleHelpModal" class="dismiss-overlay" @click="toggleHelpModal = false" />
                <div v-show="toggleHelpModal" class="menu-container base-menu position-top" style="    transform: translate(0, calc(-100% + -46px));left: 60px; width: 200px;max-height: 835px;">
                  <!-- <div class="sub-menu-container">
                    <div class="menu-item" style="padding-left: 40px; padding-right: 30px;">
                      <i class="fa fa-language fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /><span>語言</span><i class="fa fa-angle-right" aria-hidden="true" style="position: absolute; right: 15px; top: 6px;" />
                    </div>
                  </div> -->
                  <a class="menu-item" :href="tutorial" target="_blank" style="padding-left: 40px;">
                    <i class="fa fa-question-circle fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> 教學手冊 </a>
                  <div class="divider" />
                  <small class="menu-title">聯絡我們</small>
                  <!-- <a class="menu-item" href="https://www.facebook.com/hackmdio" target="_blank" style="padding-left: 40px;">
                    <i class="fa fa-facebook-square fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> Facebook </a> -->
                  <a class="menu-item" href="https://twitter.com/realMetaNetwork" target="_blank" style="padding-left: 40px;">
                    <i class="fa fa-twitter fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> Twitter(Meta Network)</a>
                  <a class="menu-item" href="https://twitter.com/realmatataki" target="_blank" style="padding-left: 40px;">
                    <i class="fa fa-twitter fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> Twitter(瞬Matataki)</a>
                  <a class="menu-item" href="https://t.me/metanetwork" target="_blank" style="padding-left: 40px;">
                    <i class="fa fa-paper-plane fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> 使用回饋
                  </a>
                  <!-- <a class="menu-item" href="mailto:support@hackmd.io" style="padding-left: 40px;">
                    <i class="fa fa-envelope-o fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /> support@hackmd.io </a> -->
                  <div class="divider" />
                  <small class="menu-title">資源</small>
                  <a class="menu-item" :href="releaseNotes" target="_blank" style="padding-left: 22px;"> 版本記錄 </a>
                  <!-- <a class="menu-item" href="https://hackmd.io/pricing" style="padding-left: 22px;"> 收費方案 </a> -->
                  <!-- <a class="menu-item" href="https://hackmd.io/c/news" target="_blank" style="padding-left: 22px;"> 部落格 </a> -->
                  <div class="divider" />
                  <small class="menu-title">政策</small>
                  <a class="menu-item" href="javascript:;" style="padding-left: 22px;"> 條款 </a>
                  <a class="menu-item" href="javascript:;" style="padding-left: 22px;"> 隱私權政策 </a>
                </div>
              </div>
            </div>
            <div v-else class="ui-next-sidenav-bottom-menu">
              <div class="user-not-logged" @click="jumpToMttkOAuth">
                登入
              </div>
            </div>
          </div>
          <div class="ui-next-sidenav-collapse-handle">
            <div class="ui-next-sidenav-collapse-handle-button">
              <img src="/images/hide-side-bar-icon.svg" width="20" height="20">
            </div>
          </div>
        </div><div class="ui-next-content">
          <div class="hidden-sm dismiss-overlay" style="display: none;" /><div class="visible-xs">
            <div class="ui-next-navbar">
              <i class="fa fa-bars ui-next-navbar-item"><div class="count small" /></i><i class="fa fa-search ui-next-navbar-item" /><div class="ui-next-navbar-title">
                我的空間
              </div>
            </div>
          </div><div class="overview-component">
            <div>
              <div class="overview-widget-group">
                <!-- <div class="category-control-widgets">
                  <div class="ui-tag-menu menu-component">
                    <button type="button" class="btn btn-default btn-label ui-tag-button" style="padding: 6px 11px; font-size: 16px; flex: 1 1 0%; margin-right: 5px; display: flex; justify-content: space-between; max-width: calc(50% - 5px); min-width: 140px;">
                      <span><i class="fa fa-tag" />&nbsp;&nbsp;標籤</span>
                    </button><div class="dismiss-overlay" style="display: none;" /><div class="menu-container base-menu position-bottom" style="display: none; top: 0px; left: 0px; max-height: calc(100vh - 40px); margin-top: 0px; width: 440px; max-width: 100vw;">
                      <div class="visible-xs close-container">
                        <i class="fa fa-times" />
                      </div><input type="text" class="form-control search" placeholder="搜尋標籤名稱"><div class="features">
                        <div class="button-container">
                          <a class="feature-button"><i class="fa fa-tags" />選擇所有標籤</a><a class="feature-button"><i class="fa fa-times" />清除選取</a>
                        </div><div class="radio-container">
                          <div class="form-check">
                            <input id="tag-and-toggle" class="form-check-input" type="radio"><label class="form-check-label" for="tag-and-toggle">AND</label>
                          </div><div class="form-check">
                            <input id="tag-or-toggle" class="form-check-input" type="radio" checked=""><label class="form-check-label" for="tag-or-toggle">OR</label>
                          </div>
                        </div>
                      </div><div class="row">
                        <div class="col-xs-6">
                          <div class="form-check ui-untagged">
                            <input id="tag-" class="form-check-input" type="checkbox"><label class="form-check-label tag-name" for="tag-"><span class="name">無標籤</span><span>(22)</span></label>
                          </div>
                        </div><div class="col-xs-6">
                          <div class="form-check">
                            <input id="tag-cool" class="form-check-input" type="checkbox"><label class="form-check-label tag-name" for="tag-cool"><span class="name">cool</span><span>(1)</span></label>
                          </div>
                        </div><div class="col-xs-6">
                          <div class="form-check">
                            <input id="tag-features" class="form-check-input" type="checkbox"><label class="form-check-label tag-name" for="tag-features"><span class="name">features</span><span>(1)</span></label>
                          </div>
                        </div><div class="col-xs-6">
                          <div class="form-check">
                            <input id="tag-updated" class="form-check-input" type="checkbox"><label class="form-check-label tag-name" for="tag-updated"><span class="name">updated</span><span>(1)</span></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <!-- <div class="sorting-widgets">
                  <div class="menu-component">
                    <div class="btn btn-default btn-label flex justify-between items-center" style="padding: 6px 12px; min-width: 130px; font-size: 16px;">
                      顯示方式<i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 5px;" />
                    </div><div class="dismiss-overlay" style="display: none;" /><div class="menu-container base-menu position-bottom" style="display: none; top: 0px; right: 40px; max-height: calc(100vh - 40px); margin-top: 0px; width: 210px;">
                      <div class="menu-item no-hover" style="padding-left: 22px;">
                        <div class="categories-toggle flex items-center">
                          <label class="switch flex items-center"><input type="checkbox" value="true" checked=""><span class="slider round" />顯示分類</label>
                        </div><small class="categories-toggle-description" style="white-space: normal; color: rgb(203, 203, 203);">我們使用每篇筆記的第一個標籤作為它的分類<div><a target="_blank" href="https://hackmd.io/c/tutorials/%2Fs%2Fhow-to-tag-notes">了解更多<i class="fa fa-angle-right" aria-hidden="true" style="margin-left: 3px;" /></a></div></small>
                      </div><div class="divider" /><small class="menu-title dib mb-1/2">筆記顯示方式</small><div class="menu-item" style="padding-left: 40px;">
                        <i class="fa fa-check fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" /><i class="fa fa-th mr-1/2" />格狀顯示
                      </div><div class="menu-item" style="padding-left: 40px;">
                        <i class="fa fa-list mr-1/2" />列表顯示
                      </div><div class="divider" /><small class="menu-title dib mb-1/2">分類排序</small><div class="menu-item" style="padding-left: 40px;">
                        <i class="fa fa-check fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />新到舊
                      </div><div class="menu-item" style="padding-left: 40px;">
                        舊到新
                      </div><div class="menu-item" style="padding-left: 40px;">
                        A 到 Z
                      </div><div class="menu-item" style="padding-left: 40px;">
                        Z 到 A
                      </div><div class="divider" /><small class="menu-title dib mb-1/2">筆記排序</small><div class="menu-item" style="padding-left: 40px;">
                        <i class="fa fa-check fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />新到舊
                      </div><div class="menu-item" style="padding-left: 40px;">
                        舊到新
                      </div><div class="menu-item" style="padding-left: 40px;">
                        A 到 Z
                      </div><div class="menu-item" style="padding-left: 40px;">
                        Z 到 A
                      </div>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
            <div class="">
              <div class="">
                <div
                  aria-label="grid"
                  aria-readonly="true"
                  class="ReactVirtualized__Grid ReactVirtualized__List"
                  role="grid"
                  tabindex="0"
                  style="box-sizing: border-box; direction: ltr; height: auto; position: relative; width: 100%; will-change: transform; overflow: hidden auto;"
                >
                  <div class="ReactVirtualized__Grid__innerScrollContainer" role="rowgroup" style="width: 100%; height: 885px; max-width: 100%; max-height: 885px; overflow: hidden; position: relative;">
                    <div style="height: 559px; left: 0px; position: absolute; top: 0px; width: 100%;">
                      <div class="list-section" style="padding-top: 5px; padding-bottom: 8px;">
                        <h1><span>全部文垱</span></h1><ul class="list inline-flex flex-row flex-wrap justify-content-start list-style-none pl-0 w-100">
                          <li v-for="(item, index) of markdownItem" :key="index" class="col-xs-12 col-sm-6 col-md-6 col-lg-4 list-style-none">
                            <div class="overview-card-container">
                              <router-link class="card-anchor" :to="`/${item.id}`" />
                              <div class="item">
                                <div class="ui-overview-pin fa fa-thumb-tack fa-fw" />
                                <div class="content text-left pt-1 pr-3/2 pl-3">
                                  <router-link :to="`/${item.id}`">
                                    <h4 class="ml-0 mt-0 mb-1/2 text flex items-end" title="Untitled">
                                      <span class="title">{{ item.title || 'Untitled' }}</span>
                                    </h4>
                                  </router-link>
                                  <router-link :to="`/${item.id}`">
                                    <p class="time" title="2021年5月27日星期四 11:28">
                                      <i><i class="fa fa-clock-o" /> 變更於 </i><i class="fromNow">{{ time(item.update_time || item.create_time) }}</i>
                                    </p>
                                  </router-link>
                                </div>
                                <div class="card-action-items-container w-100 h-3 flex justify-end items-end" style="position: absolute; bottom: 0px; right: 0px;">
                                  <span
                                    class="bookmark-button flex items-center justify-center"
                                    data-toggle="tooltip"
                                    data-title="收藏"
                                    data-placement="bottom"
                                    data-original-title=""
                                    title=""
                                    @click="toggleBookmark({ id: item.id_str, idx: index, value: !item.bookmark })"
                                  >
                                    <i class="fa" aria-hidden="true" :class="item.bookmark ? 'fa-bookmark' : 'fa-bookmark-o'" /></span>
                                  <div class="overview-card-menu-container" @click="e => remoteNotes(e, index, !item.more)">
                                    <div class="overview-card-menu menu-component white">
                                      <div
                                        class="overview-card-menu-icon"
                                        data-placement="bottom"
                                        data-toggle="tooltip"
                                        data-title="更多"
                                        data-original-title=""
                                        title=""
                                      >
                                        <span class="ui-ellipsis"><svg width="20" height="20" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.84978 13.3632C8.53228 13.3632 9.086 12.8083 9.086 12.1244C9.086 11.4405 8.53228 10.8856 7.84978 10.8856C7.16729 10.8856 6.61357 11.4405 6.61357 12.1244C6.61357 12.8083 7.16729 13.3632 7.84978 13.3632ZM7.84978 6.54977C7.16729 6.54977 6.61357 7.10463 6.61357 7.78853C6.61357 8.47242 7.16729 9.02728 7.84978 9.02728C8.53228 9.02728 9.086 8.47242 9.086 7.78853C9.086 7.10463 8.53228 6.54977 7.84978 6.54977ZM9.086 3.4529C9.086 4.13678 8.53228 4.69162 7.84978 4.69162C7.16729 4.69162 6.61357 4.13678 6.61357 3.4529C6.61357 2.76902 7.16729 2.21417 7.84978 2.21417C8.53228 2.21417 9.086 2.76902 9.086 3.4529Z" fill="#CBCBCB" /></svg></span>
                                      </div>
                                      <div v-show="item.more" class="menu-container base-menu position-left position-bottom absolute" style="margin-left: 30px;">
                                        <!-- <a class="menu-item" href="https://hackmd.io/@It_nJKeNS-ieRL2hcUZRTg/r1Ekf9htd" style="padding-left: 40px;">
                                          <i class="fa fa-eye fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />以瀏覽模式開啟
                                        </a>
                                        <div class="divider" /> -->
                                        <div class="menu-item danger" style="padding-left: 40px;" @click="removeNotes(item.id_str || item.key)">
                                          <i class="fa fa-trash fa-fw menu-fa-icon" style="position: absolute; left: 20px; top: 6px;" />刪除此筆記
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <!-- <ul class="pagination dark">
                          <li class="active">
                            <a class="page" href="#">1</a>
                          </li>
                          <li><a class="page" href="#">2</a></li>
                        </ul> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- template notes modal -->
    <div
      id="templateModal"
      class="modal fade template-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="mySmallModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" style="width: calc(100vw - 20px); max-width: 1000px;">
        <div class="modal-content template-content">
          <div class="modal-header">
            <button type="button" class="close ui-template-cancel visible-xs hidden-xs" style="margin-top: 2px !important; font-size: 15px !important; display: none;">
              <span aria-hidden="true">取消</span>
            </button>
            <button type="button" class="close ui-template-close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><i class="fa fa-times fa-18" /></span>
            </button>
            <h4 id="mySmallModalLabel" class="modal-title ui-template-title">
              <i class="fa fa-file-image-o" /> <span>從範本新增筆記</span>
            </h4>
            <h4 class="modal-title visible-xs hidden-xs ui-template-title-xs">
              <i class="fa fa-file-image-o" /> <span>從範本新增筆記</span>
            </h4>
          </div>
          <div class="modal-body" style="padding: 0px;">
            <div class="row">
              <div class="col-sm-8 template-preview-container hidden-xs">
                <div>
                  <div class="ui-template-spinner unselectable hidden-print" />
                  <iframe class="template-viewer" style="width: 100%; height: 100%; border: none;" />
                  <div class="template-empty ui-template-viewer-empty" style="display: none; margin: 0px;">
                    <img src="/not-available.svg">
                    <div>
                      <div>哎呀</div>
                      <div>這個範本無法使用</div>
                    </div>
                  </div>
                </div>
                <button type="button" class="visible-xs btn btn-primary ui-use-template-btn-mobile">
                  套用範本
                </button>
              </div>
              <div class="col-sm-4 template-list-container">
                <div class="ui-templates-container">
                  <button type="button" class="btn btn-default ui-create-template-btn">
                    <span style="margin-right: -20px;">建立新範本</span><i class="fa fa-plus fa-fw" style="float: right; margin-top: 3px;" />
                  </button>

                  <div class="dropdown ui-template-list-filter" style="margin: 20px;">
                    <a
                      id="template-list-filter"
                      class="ui-template-list-filter-label"
                      data-filter-type="all"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    ><span>全部範本</span><i class="fa fa-angle-down" aria-hidden="true" style="margin-left: 10px;" /></a>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="template-list-filter" style="right: 0px; left: auto;">
                      <li role="presentation">
                        <a role="menuitem" class="ui-template-filter-all" tabindex="-1" href="#">全部範本</a>
                      </li>

                      <li role="presentation">
                        <a role="menuitem" class="ui-template-filter-default" tabindex="-1" href="#">預設範本</a>
                      </li>
                      <li role="presentation">
                        <a role="menuitem" class="ui-template-filter-personal" tabindex="-1" href="#">個人範本</a>
                      </li>

                      <li role="presentation">
                        <a role="menuitem" class="ui-template-filter-team" tabindex="-1" href="#">團隊範本</a>
                      </li>

                      <li role="presentation">
                        <a role="menuitem" class="ui-template-filter-shared" tabindex="-1" href="#">與我分享</a>
                      </li>
                    </ul>
                  </div>
                  <div class="template-empty ui-template-list-empty">
                    <i class="fa fa-file-image-o" aria-hidden="true" />
                    <div>沒有任何範本</div>
                  </div>
                  <div class="list-group ui-template-list" style="flex:1;" />
                  <button type="button" class="btn btn-primary ui-use-template-btn hidden-xs">
                    套用範本
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- create template modal -->
    <div class="modal fade create-template-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content template-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="margin-top: 2px; height: 17px;">
              <span aria-hidden="true"><i class="fa fa-times fa-18" /></span>
            </button>
            <h4 id="myModalLabel" class="modal-title">
              建立一個範本
            </h4>
          </div>
          <div class="modal-body text-center" style="color:black; padding: 20px; padding-bottom: 10px; text-align: left;">
            <label for="templateName" style="font-size:18px; font-weight: normal;">範本名稱</label>
            <input
              id="templateName"
              type="text"
              class="form-control"
              placeholder="範本名稱"
              aria-label="TemplateName"
              aria-describedby="template-name"
              maxlength="250"
            >
          </div>
          <div class="modal-footer" style="border: none; padding: 20px;">
            <button type="button" class="btn btn-primary ui-create-template-modal-confirm" style="min-width:54px;">
              好的
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delete template modal -->
    <div class="modal fade delete-template-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content template-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="margin-top: 2px; height: 17px;">
              <span aria-hidden="true"><i class="fa fa-times fa-18" /></span>
            </button>
            <h4 id="myModalLabel" class="modal-title">
              刪除範本
            </h4>
          </div>
          <div class="modal-body text-center" style="color:black; padding: 14.5px 15px; padding-bottom: 0px; text-align: left;">
            <p class="ui-delete-modal-msg" style="font-size: 15px;">
              您確定要刪除這個範本嗎？
            </p>
            <div class="form-check" style="display: flex;">
              <input id="deleteNoteCheck" type="checkbox" class="form-check-input ui-delete-note-check" style="margin-top: 7px;">
              <label class="form-check-label" style="margin-top: 3px; margin-left: 5px; font-weight: 400;" for="deleteNoteCheck">
                保留範本內容
                <div style="font-size: 13px; margin-top: 5px; color: #818181; line-height: 18px;">僅從範本庫移除並轉為一般筆記，且保留筆記內容與版本、留言等</div>
              </label>
            </div>
          </div>
          <div class="modal-footer" style="border: none; padding: 20px 15px; display: flex;">
            <button type="button" class="btn btn-default" data-dismiss="modal" style="flex:1;">
              取消
            </button>
            <button type="button" class="btn btn-danger ui-delete-template-modal-confirm" style="flex:1;">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- create team modal -->
    <div
      id="createTeamModal"
      class="modal fade create-team-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div
            class="modal-header"
            style="background-color: #f8f8f8; border-top-left-radius: 5px;
            border-top-right-radius: 4px;"
          >
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>

            <h4 id="myModalLabel" class="modal-title">
              建立團隊
            </h4>
          </div>
          <div class="modal-body">
            <div class="alert alert-danger text-left" style="display: none;">
              <i class="fa fa-fw fa-exclamation-triangle" aria-hidden="true" />
              <span class="team-create-error" />
            </div>

            <form data-toggle="validator">
              <div class="form-group flex items-center">
                <label class="flex-one text-left" for="team-name">團隊名稱</label>
                <input
                  id="team-name"
                  type="text"
                  class="form-control flex-two"
                  name="name"
                  placeholder="您的團隊名稱"
                  data-minlength="1"
                  maxlength="80"
                  required
                >
              </div>

              <div class="form-group flex items-center">
                <label class="flex-one text-left" for="team-description">團隊描述</label>
                <input
                  id="team-description"
                  type="text"
                  class="form-control flex-two"
                  name="description"
                  placeholder="您的團隊描述"
                  maxlength="100"
                >
              </div>

              <div class="form-group flex items-center">
                <label class="flex-one text-left" for="team-path">團隊網址</label>
                <div class="flex flex-column flex-two">
                  <div class="flex items-center">
                    <span class="mr-1">https://hackmd.io/team/</span>
                    <input
                      id="team-path"
                      type="text"
                      class="form-control"
                      name="path"
                      placeholder="您的團隊網址"
                      pattern="^(?!-)[a-zA-Z0-9-]+$"
                      data-minlength="1"
                      maxlength="39"
                      required
                    >
                  </div>
                  <small style="text-align: right; color: #888888;">僅允許輸入 a-Z、0-9 以及 - 號 (非首位字元)</small>
                </div>
              </div>

              <div class="modal-footer pa-0" style="border: none;">
                <button type="button" data-dismiss="modal" class="btn btn-default">
                  取消
                </button>
                <button type="submit" class="btn btn-primary">
                  建立團隊
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- message modal -->
    <div class="modal fade message-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="myModalLabel" class="modal-title" />
          </div>
          <div class="modal-body" style="color:black;">
            <h5 style="font-weight: 500; font-size: 14px; text-align: left;" />
            <a target="_blank" style="word-break: break-all;" rel="noopener" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
              好的
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- remove team member modal -->
    <div class="modal fade remove-member-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="myModalLabel" class="modal-title">
              您確定嗎？
            </h4>
          </div>
          <div class="modal-body" style="color:black;">
            <h5 class="ui-remove-member-modal-msg">
              您確定要將這位成員移除嗎？
            </h5>
            <strong class="ui-remove-member-modal-item" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger ui-remove-member-modal-confirm">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- leave team modal -->
    <div class="modal fade leave-team-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="myModalLabel" class="modal-title">
              離開團隊
            </h4>
          </div>
          <div class="modal-body">
            <p class="ui-leave-team-modal-msg">
              您確定要離開這個團隊嗎？
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger ui-leave-team-modal-confirm">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delete team modal -->
    <div class="modal fade delete-team-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="myModalLabel" class="modal-title">
              刪除團隊
            </h4>
          </div>
          <div class="modal-body" style="text-align: left;">
            <p>一旦刪除團隊，團隊內的<span style="color:#c9302c;">筆記會被刪除，而且無法回復</span>。請確認您已匯出或轉移筆記。</p>
            <p>刪除此團隊前，請輸入團隊名稱：<span style="color: #c9302c" class="teampath-confirmation" /></p>
            <input
              type="text"
              data-minlength="1"
              maxlength="80"
              class="form-control ui-delete-team-name"
              name="name"
              placeholder="您的團隊名稱"
              required
            >
          </div>
          <div class="modal-footer" style="border-top: none; padding-top: 5px;">
            <button type="button" class="btn btn-default" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger ui-delete-team-modal-confirm">
              確定
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- delete success modal -->
    <div class="modal fade delete-team-success-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" style="max-width: 400px; margin: auto;">
        <div class="modal-content">
          <div class="modal-body" style="text-align: center; margin: 35px 0px;">
            <img src="/delete-team.svg" width="85px" height="94.7px">
            <div style="font-size: 18px; margin-top: 20px;" class="delete-team-success-message" />
          </div>
        </div>
      </div>
    </div>

    <!-- change password modal -->
    <div class="modal fade change-password-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 id="mySmallModalLabel" class="modal-title">
              修改您的密碼
            </h4>
          </div>
          <div class="modal-body" style="text-align: center;">
            <form data-toggle="validator" role="form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
              <div class="dn">
                <input type="hidden" name="_csrf" value="uucAJ3SL-7_p3YRU4dhpqB2I8iD7x1E6n7x8">
              </div>
              <div class="form-group">
                <div class="col-sm-12">
                  <input type="password" class="form-control" name="currentPassword" placeholder="舊密碼" required>
                  <span class="help-block control-label with-errors" style="display: inline;" />
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-12">
                  <input
                    id="setupNewPassword"
                    type="password"
                    class="form-control"
                    name="newPassword"
                    placeholder="新密碼"
                    required
                    data-minlength="8"
                    data-maxlength="128"
                    data-error="密碼不符合複雜度要求"
                    pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,128}$"
                  >
                  <small class="flex mt-1 db text-left">密碼長度須為 8 到 128 個字，且包含大小寫英文字母及數字。</small>
                  <span class="help-block control-label with-errors" style="display: inline;" />
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-12">
                  <input
                    type="password"
                    class="form-control"
                    name="confirmNewPassword"
                    data-match="#setupNewPassword"
                    data-match-error="哎呀，它們不符合。"
                    placeholder="確認新密碼"
                    required
                  >
                  <span class="help-block control-label with-errors" style="display: inline;" />
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-12">
                  <button type="submit" class="btn btn-primary" formaction="https://hackmd.io/settings/changePassword">
                    送出
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import moment from 'moment'
import { isEmpty } from 'lodash'
import { userStats } from '../../api/index'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import { setOAuthRedirectUri } from '../../api/developer'
import { Notes } from '../../types/index.d'

interface MarkdownItemProps extends Notes {
  key: string
  more: boolean
}

@Component({
  head () {
    return {
      link: [
        // { rel: 'stylesheet', type: 'text/css', href: 'https://ssimg.frontenduse.top/matataki-md/build/font-vendor.b86e2bf451b246b1a88e.css' },
        // { rel: 'stylesheet', type: 'text/css', href: 'https://ssimg.frontenduse.top/matataki-md/build/common-vendor.b8ecfc406ac0b5f77a26.css' },
        { rel: 'stylesheet', type: 'text/css', href: 'https://ssimg.frontenduse.top/matataki-md/build/hackmd-app-vendor.681b42e325538005fa7d.css' }
        // { rel: 'stylesheet', type: 'text/css', href: 'https://ssimg.frontenduse.top/matataki-md/build/hackmd-app.dd3987cdcf45bbb50f21.css' }
      ]
    }
  }
})
export default class Home extends Vue {
  usersData: object = {}
  markdownItem: MarkdownItemProps[] = []
  toggleUserModal = false
  toggleHelpModal = false

  get isUser () {
    return !isEmpty(this.usersData)
  }

  get releaseNotes () {
    if (process.client) {
      return process.env.APP_MATATAKI_RELEASE_NOTES
    } else {
      return ''
    }
  }

  get tutorial () {
    if (process.client) {
      return process.env.APP_MATATAKI_TUTORIAL
    } else {
      return ''
    }
  }

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
      this.getAll()

      try {
        const usersDataStore = getCookie('users') || ''
        if (usersDataStore) {
          this.usersData = JSON.parse(usersDataStore)
        } else {
          this.userStatsFn()
        }
      } catch (e) {
        console.log('e', e)
      }

      document.addEventListener('click', this.hideRemoteNotes, false)
    }
  }

  destroyed () {
    document.removeEventListener('click', this.hideRemoteNotes)
  }

  // 隐藏所有删除笔记按钮
  hideRemoteNotes () {
    this.markdownItem.forEach((i: MarkdownItemProps) => {
      i.more = false
    })
  }

  // 删除笔记
  remoteNotes (e: any, i: number, value: boolean) {
    e.stopPropagation()
    this.hideRemoteNotes()
    this.markdownItem[i].more = value
  }

  // 用户跳转
  async jumpToMttkOAuth () {
    try {
      console.log('from', location)
      await setOAuthRedirectUri(location.pathname)
    } catch (error) {
      console.log('error', error)
    }
    (window as any).location = process.env.REACT_APP_OAuthUrl
  };

  // 用户信息
  async userStatsFn (): Promise<void> {
    const res = await userStats()
    if (res.code === 0) {
      setCookie('users', JSON.stringify(res.data), 1)
      this.usersData = res.data
    }
  }

  // time format
  time (val: number) {
    return moment(val).fromNow()
  }

  // 获取全部
  async getAll () :Promise<void> {
    try {
      const keys = await (this as any).$localForage.keys()
      // console.log('keys', keys)
      const list = []
      for (let i = 0; i < keys.length; i++) {
        const ele = keys[i]
        const res = await (this as any).$localForage.getItem(ele)
        // console.log('res', res)
        res.key = ele // 防止丢失 key 做的一层 防止清理不掉
        res.more = false
        list.push(res)
      }

      const mdItem = list.sort((a: any, b: any) => b.update_time - a.update_time)

      this.markdownItem = mdItem
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 创建笔记
  async handleSubmit () :Promise<void> {
    const time = Date.now()
    await (this as any).$localForage.setItem(time, {
      id: time,
      id_str: String(time),
      title: 'Untitled',
      content: '',
      create_time: time,
      update_time: time,
      bookmark: false
    })
    this.$router.push(`/${time}`)
  }

  // 删除笔记
  async removeNotes (key: string) {
    try {
      await (this as any).$localForage.removeItem(key)
      this.getAll()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 切换收藏
  async toggleBookmark ({ id, idx, value }: { id: string, idx: number, value: boolean }) {
    try {
      console.log('id', id, idx)
      const res = await (this as any).$localForage.getItem(id)
      await (this as any).$localForage.setItem(id, Object.assign(res, {
        bookmark: value
      }))
      await this.getAll()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 退出登录
  signOut () {
    removeCookie('access-token')
    removeCookie('users-github')
    removeCookie('users')
    this.usersData = {}
  }
}
</script>
<style scoped src="./hackmd-app.dd3987cdcf45bbb50f21.css"></style>
<style lang="less" scoped>
.ui-next-sidenav-inner>* { text-align: left; }
.user-not-logged {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
