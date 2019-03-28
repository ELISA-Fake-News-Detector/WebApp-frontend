(function() {
  $(function() {
    var input, update;
    document.querySelector(".form").classList.remove("hidden");
    input = {
      rating: 80
    };

    update = function() {
      var i, index, results;
      position = input.rating;
      keyframes = {
        0: {
          sides: 444,
        },
        25: {
          sides: 423,
        },
        50: {
          sides: 400,
        },
        75: {
          sides: 350,
        },
        100: {
          sides: 360,
        }
      };
      results = [];
      return results;
    };
    window.updateSlider = function(value) {
      var listIndex;
      input.rating = value;
      update();
      listIndex = ~~(value / 10);
      return document.querySelector(".sliding-list ul").style.transform = `translateY(${-listIndex * 1.5}em)`;
    };
    return updateSlider(80);
  });

}).call(this);


function showData() {
  document.getElementById('data').style.display = 'block';
  document.getElementById('analysis').style.display = 'none';
  document.getElementById('prediction').style.display = 'none';
  document.getElementsByClassName('data')[0].className = 'nav-link active data';
  document.getElementsByClassName('analysis')[0].className = 'nav-link analysis';
  document.getElementsByClassName('prediction')[0].className = 'nav-link prediction';
}
function showAnalysis() {
  document.getElementById('data').style.display = 'none';
  document.getElementById('analysis').style.display = 'block';
  document.getElementById('prediction').style.display = 'none';
  document.getElementsByClassName('data')[0].className = 'nav-link data';
  document.getElementsByClassName('analysis')[0].className = 'nav-link active analysis';
  document.getElementsByClassName('prediction')[0].className = 'nav-link prediction';
}

function showPrediction() {
  document.getElementById('data').style.display = 'none';
  document.getElementById('analysis').style.display = 'none';
  document.getElementById('prediction').style.display = 'block';
  document.getElementsByClassName('data')[0].className = 'nav-link data';
  document.getElementsByClassName('analysis')[0].className = 'nav-link analysis';
  document.getElementsByClassName('prediction')[0].className = 'nav-link prediction active';
}
