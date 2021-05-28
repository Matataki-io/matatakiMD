<template>
  <div>
    <header class="header-wrapper home-header-wrapper">
      <div class="container-fluid header black home-header">
        <div class="row">
          <div class="col-xs-12">
            <nav class="navbar">
              <div class="navbar-header">
                <button type="button" class="ui-navbar-toggle right navbar-toggle collapsed" data-toggle="sidenav" data-target="#header-navbar" aria-expanded="false">
                  <i class="fa fa-bars" />
                </button>
                <a class="navbar-brand btn btn-link " href="https://hackmd.io/home"><i class="fa fa-file-text" />&nbsp;MatatakiMD </a>
              </div>
              <div id="header-navbar" class="collapse navbar-collapse right">
                <ul class="nav navbar-nav navbar-right">
                  <li class="visible-xs" style="padding: 20px 30px 40px 30px;">
                    <img src="https://hackmd.io/images/home/group.svg" class="pull-right">
                  </li>
                  <li>
                    <a target="_blank" href="https://hackmd.io/c/tutorials-tw">使用教學</i></a>
                  </li>
                  <li class="divider visible-xs" style="margin: 12px 0px; background-color: #4f4f4f;" />
                  <li class="ui-home-login">
                    <a href="javascript:;" @click="jumpToMttkOAuth">登入</i></a>
                  </li>
                </ul>
              </div> <!-- /.collapse.navbar-collapse -->
            </nav>
          </div> <!-- /.col-xs-12 -->
        </div> <!-- /.row -->
      </div> <!-- /.container-fluid -->
    </header>

    <div id="site-content" class="site-wrapper pt-1/4" style="padding-top: 50px;">
      <div id="home">
        <div class="container" />
        <div class="home-container container pt-3-xs pb-10-xs pt-9-md pb-16-md">
          <div class="row mb-18">
            <div class="col-xs-12">
              <h1 class="cover-heading ma-0">
                用 Markdown 即時協作知識庫
              </h1>
              <p class="lead ma-0" style="max-width: 680px; margin: auto; margin-bottom: 30px;">
                用即時協作的 Markdown 編輯器書寫
                <span class="typewriter-container inline-flex justify-center en">
                  <span class="typewriter-text text-1">專案</span>
                  <span class="typewriter-text text-2">團隊</span>
                  <span class="typewriter-text text-3">技術</span>
                  <span class="typewriter-text text-4">個人</span>
                </span>
                文件，讓你快速協作、輕鬆紀錄想法、隨時共享知識。
              </p>

              <form action="https://hackmd.io/join" class="input-group mt-3" method="get" style="display: flex; max-width: 680px; margin: auto;">
                <input type="email" name="email" class="form-control ui-home-email" placeholder="請輸入您的 Email" disabled>
                <div class="input-group-append">
                  <button type="submit" class="btn btn-success btn-lg ui-home-join">
                    立即登入
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="home-container bg-white">
          <div id="carouselFirstIndicators" class="carousel slide row" data-ride="carousel">
            <div class="col-xs-12 visible-xs">
              <h1 class="section-title">
                <div>高效率團隊協作</div>
                <div>權限設定控管隱私</div>
              </h1>
            </div>
            <div class="col-xs-12 col-md-6 mb-3-xs mb-0-md">
              <div class="carousel-inner pull-right" style="width: auto;">
                <div class="item active">
                  <img src="https://hackmd.io/images/home/IndexPic_1-1.svg" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="item">
                  <img src="https://hackmd.io/images/home/IndexPic_1-2.svg" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="item">
                  <img src="https://hackmd.io/images/home/IndexPic_1-3.svg" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 text-left">
              <h1 class="section-title hidden-xs">
                <div>高效率團隊協作</div>
                <div>權限設定控管隱私</div>
              </h1>
              <div class="carousel-indicators">
                <div class="carousel-item active" data-target="#carouselFirstIndicators" data-slide-to="0">
                  <img src="https://hackmd.io/images/home/index-team-value-01.svg" class="icon">
                  <div>
                    <div class="title">
                      跨越時空協作
                    </div>
                    <div class="content">
                      超快即時協作，讓遠端團隊感覺近在咫尺。文件更新通知，讓您跨越時間同步進度
                    </div>
                  </div>
                </div>
                <div class="carousel-item" data-target="#carouselFirstIndicators" data-slide-to="1">
                  <img src="https://hackmd.io/images/home/index-team-value-02.svg" class="icon">
                  <div>
                    <div class="title">
                      輕鬆共享知識
                    </div>
                    <div class="content">
                      共享所有團隊文件，讓知識及進度一目瞭然，共用團隊範本讓文件格式保持一致
                    </div>
                  </div>
                </div>
                <div class="carousel-item" data-target="#carouselFirstIndicators" data-slide-to="2">
                  <img src="https://hackmd.io/images/home/index-team-value-03.svg" class="icon">
                  <div>
                    <div class="title">
                      分級保護隱私
                    </div>
                    <div class="content">
                      依照需求為內部或外部夥伴細緻設定不同權限，私人圖床更保護機密
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row pt-2">
            <div class="col-xs-12 text-right button-container">
              <a href="https://hackmd.io/join?create-team=true" class="ui-home-create-team btn btn-lg btn-primary" style="min-width: 145px;">建立免費團隊</a>
            </div>
          </div>
        </div>

        <div class="home-container bg-white pt-0">
          <div id="carouselSecondIndicators" class="carousel reverse slide row" data-ride="carousel">
            <div class="col-xs-12 visible-xs">
              <h1 class="section-title">
                <div>整合您喜愛的工具與流程</div>
                <div>並完全擁有您的內容</div>
              </h1>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="carousel-inner pull-right" style="width: auto;">
                <div class="item active">
                  <img src="https://hackmd.io/images/home/IndexPic_2-1.svg" class="d-block w-100" alt="Slide 1">
                </div>
                <div class="item">
                  <img src="https://hackmd.io/images/home/IndexPic_2-3.svg" class="d-block w-100" alt="Slide 2">
                </div>
                <div class="item">
                  <img src="https://hackmd.io/images/home/IndexPic_2-2.svg" class="d-block w-100" alt="Slide 3">
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-6 text-left">
              <h1 class="section-title hidden-xs">
                <div>整合您喜愛的工具與流程</div>
                <div>並完全擁有您的內容</div>
              </h1>
              <div class="carousel-indicators">
                <div class="carousel-item active" data-target="#carouselSecondIndicators" data-slide-to="0">
                  <img src="https://hackmd.io/images/home/index-value-01.svg" class="icon">
                  <div>
                    <div class="title">
                      用 Markdown 寫作任何文件
                    </div>
                    <div class="content">
                      待辦事項、技術筆記、畫流程圖、甚至簡報
                    </div>
                  </div>
                </div>
                <div class="carousel-item" data-target="#carouselSecondIndicators" data-slide-to="1">
                  <img src="https://hackmd.io/images/home/index-value-02.svg" class="icon">
                  <div>
                    <div class="title">
                      與 GitHub 同步
                    </div>
                    <div class="content">
                      用 PR 流程管理文件版本、分散式儲存筆記
                    </div>
                  </div>
                </div>
                <div class="carousel-item" data-target="#carouselSecondIndicators" data-slide-to="2">
                  <img src="https://hackmd.io/images/home/index-value-03.svg" class="icon">
                  <div>
                    <div class="title">
                      讓工具為您服務
                    </div>
                    <div class="content">
                      匯出所有筆記、用 VSCode 在本機書寫、在瀏覽器裡工作
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row pt-0-xs pt-3/2-md">
            <div class="col-xs-12 text-left button-container">
              <form action="https://hackmd.io/template/template-Try-it?redirect=true" method="POST">
                <div class="dn">
                  <input type="hidden" name="_csrf" value="V8FCywhL-Vx-Kdn2xEv9raJvO1Xgc3WjBY9E">
                </div>
                <button type="submit" class="ui-new-note ui-new-note-features btn btn-lg btn-primary" style="min-width: 110px;">
                  免費試用
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="home-container">
          <div class="row">
            <div class="col-xs-12">
              <h2 class="home-heading" style="margin-bottom: 15px;">
                特色功能
              </h2>
              <div style="margin-bottom: 25px; font-size: 20px;">
                提高效能於無形之中
              </div>
            </div>
          </div>
          <div class="row flex flex-wrap ph-0-md mh-0-md">
            <div class="col-xs-12" /> <!-- hack for safari -->
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-01.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>VSCode 擴充功能</strong>
                </p>
                <div class="subtitle">
                  用 VSCode 來瀏覽或寫作所有 MatatakiMD 支援的 Markdown 語法
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://marketplace.visualstudio.com/items?itemName=HackMD.vscode-hackmd">立即安裝<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-02.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>GitHub 整合</strong>
                </p>
                <div class="subtitle">
                  用您最熟悉的 GitHub 流程控制版本及交付您的文件
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2Flink-with-github-tw">了解更多<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-03.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>瀏覽器擴充功能</strong>
                </p>
                <div class="subtitle">
                  用快速鍵迅速找到並打開您的文件，捕捉瞬間的想法，並保持在心流之中
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2Fhackmd-it-tw">立即安裝<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-04.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>MathJax 及 UML</strong>
                </p>
                <div class="subtitle">
                  用純文字繪製 UML 圖表及數學式，一個工具搞定專業內容數位出版
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2FMathJax-and-UML-tw">了解更多<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-05.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>簡報模式</strong>
                </p>
                <div class="subtitle">
                  輕鬆製作簡報，幾分鐘內就可以上台。用章節組織簡報，精準控制時間
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2Fhow-to-create-slide-deck-tw">了解更多<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 ph-3/2 feature-card mb-3">
              <div class="content">
                <img src="https://hackmd.io/images/home/feature-06.svg" class="icon">
                <p class="title mb-3/2 mt-2">
                  <strong>書本模式</strong>
                </p>
                <div class="subtitle">
                  依照主題快速編排筆記合集、主次標題整理章節，一次分享所有相關內容
                </div>
                <div class="feature-button-container">
                  <a class="learn-more" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2Fhow-to-create-book-tw">了解更多<i class="fa fa-angle-right" aria-hidden="true" /></a>
                </div>
              </div>
            </div>
          </div>
          <a class="btn btn-default btn-lg btn-outline" target="_blank" href="https://hackmd.io/c/tutorials-tw/%2Fs%2Ftutorials-tw">更多功能</a>
        </div>

        <div class="home-container pt-0">
          <div class="row">
            <div class="col-xs-12">
              <h2 class="home-heading">
                加入這些高效能團隊
              </h2>
            </div>
          </div>
          <div class="row trusted-by-customer-block">
            <a class="customer-card"><img src="https://hackmd.io/images/home/logo-ethereum.svg" alt="ethereum"></a>
            <a class="customer-card"><img src="https://hackmd.io/images/home/logo-g-0-v.svg" alt="g0v"></a>
            <a class="customer-card"><img src="https://hackmd.io/images/home/logo-procore.svg" alt="procore"></a>
            <a class="customer-card"><img src="https://hackmd.io/images/home/logo-rayark.svg" alt="rayark"></a>
            <a class="customer-card"><img src="https://hackmd.io/images/home/logo-crowd-works.png" alt="crowd-works"></a>
          </div>

          <div class="mt-6">
            <div class="customer-testimonial ph-3/2">
              <div class="testimonial-block text-gray-lightest mh-auto mb-2 ph-0 ph-7-sm pt-6 pt-0-sm text-left" style="max-width: 790px;">
                <img class="quote quote-l" src="https://hackmd.io/images/quote-L.svg">
                <img class="quote quote-r dn db-sm" src="https://hackmd.io/images/quote-R.svg">

                <p class="mb-3">
                  我們在尋找能讓團隊討論更透明與容易存取的方法，最近從 Google Docs 換到 HackMD。HackMD 提供一致的 Markdown 編輯器與預覽結果，這跟之前的使用方式很相似也符合我們的需求。短時間內，會議記錄改善了許多，讓我們作為團隊更能良好的互相合作。
                </p>

                <p class="text-gray-lighter-2 text-left">
                  <span class="text-bold">Bryan Van de Ven</span>
                  <br>
                  <span>Bokeh 共同創造者與專案主管</span>
                </p>
              </div>
            </div>
          </div>

          <div style="max-width: 960px;" class="mh-auto mt-12 ph-3/2 blog-posts">
            <h2 class="home-heading" style="line-height: 52px;">
              我們的顧客如何使用 MatatakiMD
            </h2>
            <div class="flex flex-column flex-row-sm justify-center">
              <div class="flex-one mr-2-sm">
                <img class="mw-100 w-100" src="https://hackmd.io/images/home/blog/k8s.png">
              </div>

              <div class="text-left flex-one ml-2-sm">
                <h3 class="mt-3 mt-0-sm blog-title">
                  How I use MatatakiMD in Open Source projects
                </h3>

                <p class="text-gray-lightest mb-3" style="font-size: 16px;">
                  One of the major properties of successful open source projects is their ability to be transparent with their communities.<br>This involves everything from open governance, to values, to technical direction.
                </p>

                <p class="text-gray-lighter-2" style="font-size: 16px;">
                  <span class="text-bold">Jorge O. Castro</span>
                  <br>
                  <span>Kubernetes</span>
                </p>

                <a target="_blank" href="https://hackmd.io/@hackmd/customer-stories/https%3A%2F%2Fhackmd.io%2F%40hackmd%2Fk8s-story">
                  <button class="btn btn-outline btn-lg btn-gray mt-3">
                    了解更多
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="home-container bg-white">
          <div class="row">
            <div class="col-xs-12">
              <h2 class="home-heading">
                每個團隊都有適合您的 MatatakiMD
              </h2>
            </div>
            <div class="col-xs-12">
              <div class="plans flex flex-column flex-row-sm items-stretch justify-between text-left">
                <a class="plan order-0-sm order-0 mb-3" href="https://hackmd.io/pricing">
                  <div class="ribbon text-uppercase">Hot</div>
                  <div class="title">
                    <img src="https://hackmd.io/images/home/team-plan.svg" alt="team-plan">
                    <h2>團隊方案</h2>
                  </div>
                  <p>
                    適合中小型團隊，加速您的專案協作
                  </p>

                  <ul class="pl-0 list-checks mh-1/4">
                    <li class="flex">共用團隊文件空間</li>
                    <li class="flex">成員數量無上限</li>
                    <li class="flex">私有圖片上傳空間</li>
                  </ul>
                </a>

                <a class="plan order-1-sm order-1 mb-3" href="https://hackmd.io/pricing">
                  <div class="title">
                    <img src="https://hackmd.io/images/home/ee-plan.svg" alt="ee-plan">
                    <h2>商業方案</h2>
                  </div>
                  <p>
                    進階隱私及權限設定為大型團隊管控資訊流
                  </p>

                  <ul class="pl-0 list-checks mh-1/4">
                    <li class="flex">自架設版本</li>
                    <li class="flex">SSO 或客製登入方式</li>
                    <li class="flex">Role-based 權限設定</li>
                    <li class="flex">共用團隊文件空間</li>
                    <li class="flex">團隊數量無上限</li>
                    <li class="flex">成員數量無上限</li>
                    <li class="flex">私有圖片上傳空間</li>
                  </ul>
                </a>
              </div>
            </div>
            <a class="btn btn-primary btn-lg btn-outline" href="https://hackmd.io/pricing">了解更多</a>
          </div>
        </div>

        <div class="home-container container pv-10-md">
          <div class="row">
            <div class="col-xs-12">
              <p class="h3 mt-0 mb-3" style="font-size: 30px;">
                加入 MatatakiMD 的 100,00+ 名使用者，一用就愛上 ❤️
              </p>
              <form action="https://hackmd.io/join" class="input-group" method="get" style="display: flex; max-width: 680px; margin: auto;">
                <input type="email" name="email" class="form-control ui-home-email" placeholder="請輸入您的 Email" disabled>
                <div class="input-group-append">
                  <button type="submit" class="btn btn-success btn-lg ui-home-join">
                    立即登入
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- delete modal -->
    <div class="modal fade delete-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
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
            <h5 class="ui-delete-modal-msg" />
            <strong class="ui-delete-modal-item" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger ui-delete-modal-confirm">
              確定
            </button>
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
                    <img src="https://hackmd.io/not-available.svg">
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
                  <button
                    type="button"
                    class="btn btn-success"
                    style="margin: 20px; margin-bottom: 10px; height: 40px; font-size: 16px;"
                    data-toggle="modal"
                    data-target=".signin-modal"
                  >
                    登入
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
                        <a role="menuitem" class="ui-template-filter-team" tabindex="-1" href="#">團隊範本</a>
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

    <!-- signin modal -->
    <div class="modal fade signin-modal" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="margin-top: 10px; right: 20px; position: absolute;">
            <span aria-hidden="true">&times;</span>
          </button>

          <h3>登入</h3>

          <form data-toggle="validator" role="form" class="form-horizontal" method="post" enctype="application/x-www-form-urlencoded">
            <div class="dn">
              <input type="hidden" name="_csrf" value="V8FCywhL-Vx-Kdn2xEv9raJvO1Xgc3WjBY9E">
            </div>
            <div class="dn">
              <input type="hidden" name="create_team" value="false">
            </div>
            <div class="dn">
              <input type="hidden" name="create_paid_team" value="false">
            </div>
            <div class="form-group  ">
              <label for="email" class="control-label">Email</label>
              <label for="inputEmail" class="control-label pull-right errors" />
              <span class="help-block control-label with-errors pull-right" style="display: inline;" />
              <div class="input-block">
                <input
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="您的 Email"
                  required
                  autocomplete="email"
                >

                <span class="error-sign" />
              </div>
            </div>
            <div class="form-group ">
              <label for="password" class="control-label">密碼</label>
              <label for="inputPassword" class="control-label pull-right errors" />
              <span class="help-block control-label with-errors pull-right" style="display: inline;" />
              <div class="input-block">
                <input
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="您的密碼"
                  required
                  autocomplete="current-password"
                >
                <span class="error-sign" />

                <span class="control-label pull-right" style="font-size: 13px; margin-top: 5px;"><a href="https://hackmd.io/settings/forgotPassword" style="text-decoration: underline;">忘記密碼</a></span>
              </div>
            </div>

            <div style="text-align: center; padding-top: 15px; margin-bottom: 0px;">
              <input type="submit" class="btn btn-success btn-large" formaction="https://hackmd.io/login" value="登入">
            </div>
          </form>

          <p class="seperator">
            或是
          </p>

          <p>繼續登入，代表您同意<a href="https://hackmd.io/s/terms" target="_blank">服務條款</a>。</p>

          <div class="social-buttons-container">
            <a href="https://hackmd.io/auth/facebook" class="btn btn-lg btn-block btn-social btn-facebook">
              <i class="fa fa-facebook" /> 透過 Facebook 登入
            </a>

            <a href="https://hackmd.io/auth/twitter" class="btn btn-lg btn-block btn-social btn-twitter">
              <i class="fa fa-twitter" /> 透過 Twitter 登入
            </a>

            <a href="https://hackmd.io/auth/github" class="btn btn-lg btn-block btn-social btn-github">
              <i class="fa fa-github" /> 透過 GitHub 登入
            </a>

            <a href="https://hackmd.io/auth/dropbox" class="btn btn-lg btn-block btn-social btn-dropbox">
              <i class="fa fa-dropbox" /> 透過 Dropbox 登入
            </a>

            <a href="https://hackmd.io/auth/google" class="btn btn-lg btn-block btn-social btn-google">
              <i class="icon icon-google" /> 透過 Google 登入
            </a>
          </div>

          <div>
            <p>第一次使用 HackMD？ <a href="https://hackmd.io/join">註冊</a></p>
          </div>
        </div>
      </div>
    </div>

    <!-- feedback modal -->
    <div class="modal fade feedback-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" style="padding: 8px 15px; font-weight: 700">
            <button type="button" class="close" aria-label="Close" style="font-size: 26px; margin-top: -1px;" data-dismiss="modal">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title">
              使用回饋
            </h4>
          </div>
          <div class="modal-body" style="text-align: left;">
            <div class="alert alert-danger" style="display: none;">
              <i class="fa fa-exclamation-triangle" aria-hidden="true" style="margin-right: 5px" />
              傳送失敗，請再試一次
            </div>
            <h3 style="margin-top:5px">
              感謝您的使用
            </h3>
            <p>從 0 到 10 分，請問您向朋友、家人、或同事推薦 MatatakiMD 的可能性有多高？</p>
            <div class="rating-group" style="margin-top: 15px; margin-bottom: 30px;" />
            <p style="font-size:16px">
              希望您可以提供一些建議，幫助我們改善 MatatakiMD 💪
            </p>
            <form role="form" data-toggle="validator">
              <div class="form-group" style="margin-bottom: 10px;">
                <textarea
                  name="feedback"
                  class="form-control"
                  placeholder="請輸入您的使用回饋"
                  rows="3"
                  style="resize: none;"
                  required
                />
              </div>
              <div class="checkbox" style="font-size:16px">
                <label>
                  <input name="engage" type="checkbox" checked>
                  我願意參與使用者訪談或後續改版測試，讓開發團隊更能完整理解我的需求
                </label>
              </div>
              <div class="form-group flex items-center" style="font-size: 16px; padding-left: 20px;">
                <label style="font-weight: normal;">我的 Email：</label>
            &nbsp;
                <div class="flex-auto pr-0">
                  <input
                    type="email"
                    name="email"
                    class="form-control col-sm-9"
                    aria-describedby="helpId"
                    placeholder="請輸入您的 Email"
                    required
                  >
                </div>
              </div>
              <div class="modal-footer" style="padding: 15px 0; border: none;">
                <button type="button" class="btn btn-default" data-dismiss="modal">
                  取消
                </button>
                <button type="submit" class="btn btn-primary ui-feedback-submit">
                  送出回饋
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- feedback success modal -->
    <div class="modal fade feedback-success-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
          <div class="modal-body" style="padding: 50px 20px; text-align: center;">
            <img src="/images/feedback.svg" width="85" height="95">
            <h4>感謝您的使用回饋</h4>
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

    <footer class="bg-gray-darkest text-left pv-4">
      <div class="container-thin">
        <div class="row">
          <div class="col-xs-12">
            <div class="row mb-1">
              <div class="col-xs-12 col-sm-6 col-md-3 ph-2 mb-3 mb-0-md">
                <h4 class="mt-0 pb-1/4">
                  使用教學
                </h4>

                <ul class="list-unstyled">
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/c/tutorials-tw/%2Fs%2Fquick-start-tw" class="text-gray-lighter">
                      快速入門
                    </a>
                  </li>
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/c/tutorials-tw" class="text-gray-lighter">
                      教學手冊
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 ph-2 mb-3 mb-0-md">
                <h4 class="mt-0 pb-1/4">
                  資源
                </h4>

                <ul class="list-unstyled">
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/pricing" class="text-gray-lighter">
                      收費方案
                    </a>
                  </li>
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/s/release-notes" class="text-gray-lighter">
                      版本記錄
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 ph-2 mb-3 mb-0-md">
                <h4 class="mt-0 pb-1/4">
                  政策
                </h4>

                <ul class="list-unstyled">
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/s/terms" target="_blank" class="text-gray-lighter">
                      條款
                    </a>
                  </li>
                  <li class="pv-1/4">
                    <a href="https://hackmd.io/s/privacy" target="_blank" class="text-gray-lighter">
                      隱私權政策
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-3 ph-2 mb-3 mb-0-md">
                <h4 class="mt-0 pb-1/4">
                  聯絡我們
                </h4>

                <ul class="list-unstyled">
                  <li class="pv-1/4">
                    <a href="mailto:support@hackmd.io" class="text-gray-lighter">
                      <i class="fa fa-fw fa-envelope" /> support@hackmd.io
                    </a>
                  </li>
                  <li class="pv-1/4">
                    <a href="https://facebook.com/hackmdio" class="text-gray-lighter" target="_blank">
                      <i class="fa fa-fw fa-facebook-square" /> MatatakiMD
                    </a>
                  </li>
                  <li class="pv-1/4">
                    <a href="https://twitter.com/hackmdio" class="text-gray-lighter" target="_blank">
                      <i class="fa fa-fw fa-twitter" /> @hackmdio
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> <!-- /.row -->

        <hr class="w-100" style="border-color: #6D6D6D;">

        <div class="row">
          <div class="col-xs-12 col-sm-6 flex items-center">
            <span class="ui-brand pr-1">
              &copy; 2021 MatatakiMD. All Rights Reserved.
            </span>
          </div>

          <div class="col-xs-12 col-sm-6 flex justify-start-xs justify-end-sm flex-row-sm flex-column-xs items-start-xs items-center-sm">
            <!-- <form action="https://www.paypal.com/cgi-bin/webscr" target="_blank" class="pr-1/4 dib mt-2-xs mb-1-xs db-xs">
              <input type="hidden" name="cmd" value="_donations">
              <input type="hidden" name="business" value="KDGS4PREHX6QQ">
              <input type="hidden" name="lc" value="US">
              <input type="hidden" name="item_name" value="HackMD">
              <input type="hidden" name="currency_code" value="USD">
              <input type="hidden" name="bn" value="PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted">
              <button type="submit" class="btn-link ph-0 text-uppercase">
                <i class="fa fa-coffee" /> 捐贈我們一杯咖啡
              </button>
                    &ensp;<span class="text-gray">$</span> <input class="w-4" type="number" name="amount" min="1" value="5">
            </form> -->

            <!-- <select title="Language" class="ui-locale">
              <option value="en">
                English
              </option>
              <option value="zh">
                中文
              </option>
              <option value="fr">
                Français
              </option>
              <option value="de">
                Deutsch
              </option>
              <option value="ja">
                日本語
              </option>
              <option value="es">
                Español
              </option>
              <option value="ca">
                Català
              </option>
              <option value="el">
                Ελληνικά
              </option>
              <option value="pt">
                Português
              </option>
              <option value="it">
                italiano
              </option>
              <option value="tr">
                Türkçe
              </option>
              <option value="ru">
                Русский
              </option>
              <option value="nl">
                Nederlands
              </option>
              <option value="hr">
                hrvatski jezik
              </option>
              <option value="pl">
                język polski
              </option>
              <option value="uk">
                Українська
              </option>
              <option value="hi">
                हिन्दी
              </option>
              <option value="sv">
                svenska
              </option>
              <option value="eo">
                Esperanto
              </option>
              <option value="da">
                dansk
              </option>
            </select> -->
          </div>
        </div>  <!-- /.row -->
      </div> <!-- /.container-thin -->
    </footer>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import { setOAuthRedirectUri } from '../api/developer'

@Component({
})
export default class Home extends Vue {
  async jumpToMttkOAuth () {
    try {
      console.log('from', location)
      await setOAuthRedirectUri(location.pathname)
    } catch (error) {
      console.log('error', error)
    }
    (window as any).location = process.env.REACT_APP_OAuthUrl
  };
}
</script>

<style lang="less" scoped src="./index/index.less"></style>
