import $ from 'jquery';
import template from './app.stache!';
import config from 'viewer/app-config';

import 'viewer/component/';

if ((0 || Modernizr.touch) && ($.cookie('useDesktop') !== 'true')) {
  // This is a touch enabled device, we'll redirect to mobile site.
  // desktopURL will redirect a mobile user back to the desktop landing page.
  config.desktopURL = 'desktop.min.html';
  window.location = 'mobile.min.html?' + $.param(config);
} else {
  // window.location = 'desktop.min.html?' + $.param(config);
  // window.location = 'A2J_ViewerApp.html?' + $.param(config);

  if (window.history && 'pushState' in window.history) {
    var href = window.location.href;
    window.history.pushState(null, null, href + '?' + $.param(config));
  }

  $('#viewer-app').html(template({}));

  // window.location = http://localhost:54583/Interview/A2J5/viewer/desktop.min.html?templateURL=..%2F..%2FA2JGetInterview.aspx%3Fdata%3D2417^b4e01b9c-4573-4776-b195-cb9490ac0c3b^1c725dd1-8bf6-4dc5-955d-b0cfb94600a5&fileDataURL=http%3A%2F%2Flocalhost%3A54583%2FAssets%2FA2J_Modules%2FNew+York%2FVacate_Judgment_Consumer_Debt_2417%2F&getDataURL=A2JGetData.aspx%3Fdata%3D0^b4e01b9c-4573-4776-b195-cb9490ac0c3b^2417^dcb160b4-7321-44c5-a99a-92d3e3efc1d6&setDataURL=..%2FEngine%2FIndex%3Fq%3D6ick6e1t9CGdhvn%2B4ZDvkluGkgjfo%2FWZ9JkfJHXuyVKOBFj8ImxjPEfdygh4isgV7aDXg4hf5pKqRDHkQ%2FLZh1CBeIp9fuPfDT3jRXSaxrMEcuLrOVKIOfIyu6ceh9gTGkkbNFjDhQ%2BsLDrKt2jRnDaxpszkvXjFhhgqNtqM9V37wMgJq72zEoRPIUbEjRwHPg6i8g812pzK9gFIRHkVHcVAhM%2FdWQsqof9bXQ3azmANnQz6yXw1rJ75RpjlJ%2BKY7UGCwLxu86a5fLHzXWLwbg%3D%3D&exitURL=A2JExit.aspx
  // window.location = 'desktop.min.html?templateURL=..%2F..%2FA2JGetInterview.aspx%3Fdata%3D2417^b4e01b9c-4573-4776-b195-cb9490ac0c3b^1c725dd1-8bf6-4dc5-955d-b0cfb94600a5&fileDataURL=http%3A%2F%2Flocalhost%3A54583%2FAssets%2FA2J_Modules%2FNew+York%2FVacate_Judgment_Consumer_Debt_2417%2F&getDataURL=A2JGetData.aspx%3Fdata%3D0^b4e01b9c-4573-4776-b195-cb9490ac0c3b^2417^dcb160b4-7321-44c5-a99a-92d3e3efc1d6&setDataURL=..%2FEngine%2FIndex%3Fq%3D6ick6e1t9CGdhvn%2B4ZDvkluGkgjfo%2FWZ9JkfJHXuyVKOBFj8ImxjPEfdygh4isgV7aDXg4hf5pKqRDHkQ%2FLZh1CBeIp9fuPfDT3jRXSaxrMEcuLrOVKIOfIyu6ceh9gTGkkbNFjDhQ%2BsLDrKt2jRnDaxpszkvXjFhhgqNtqM9V37wMgJq72zEoRPIUbEjRwHPg6i8g812pzK9gFIRHkVHcVAhM%2FdWQsqof9bXQ3azmANnQz6yXw1rJ75RpjlJ%2BKY7UGCwLxu86a5fLHzXWLwbg%3D%3D&exitURL=A2JExit.aspx';
  // window.location = 'A2J_ViewerApp.html?templateURL=..%2F..%2FA2JGetInterview.aspx%3Fdata%3D2417^b4e01b9c-4573-4776-b195-cb9490ac0c3b^1c725dd1-8bf6-4dc5-955d-b0cfb94600a5&fileDataURL=http%3A%2F%2Flocalhost%3A54583%2FAssets%2FA2J_Modules%2FNew+York%2FVacate_Judgment_Consumer_Debt_2417%2F&getDataURL=A2JGetData.aspx%3Fdata%3D0^b4e01b9c-4573-4776-b195-cb9490ac0c3b^2417^dcb160b4-7321-44c5-a99a-92d3e3efc1d6&setDataURL=..%2FEngine%2FIndex%3Fq%3D6ick6e1t9CGdhvn%2B4ZDvkluGkgjfo%2FWZ9JkfJHXuyVKOBFj8ImxjPEfdygh4isgV7aDXg4hf5pKqRDHkQ%2FLZh1CBeIp9fuPfDT3jRXSaxrMEcuLrOVKIOfIyu6ceh9gTGkkbNFjDhQ%2BsLDrKt2jRnDaxpszkvXjFhhgqNtqM9V37wMgJq72zEoRPIUbEjRwHPg6i8g812pzK9gFIRHkVHcVAhM%2FdWQsqof9bXQ3azmANnQz6yXw1rJ75RpjlJ%2BKY7UGCwLxu86a5fLHzXWLwbg%3D%3D&exitURL=A2JExit.aspx';
}
