(function() {
	var controller = {
		/**
		 * 最初の処理。
		 */
		start: function() {
			this.$canvas = $('#my-canvas');
			this.elCanvas = this.$canvas[0];
			this.canvasContext = this.elCanvas.getContext('2d');

			$('.js-reset').on('click', this.onclickReset.bind(this));
			$('.js-switch-color').on('click', this.onclickSwitchColor.bind(this));

			// すぐcanvasを初期化する
			this.reset();
		},

		/**
		 * canvasを初期化し画像を読み込む。
		 */
		reset: function() {
			this._loadImage(function(image) {
				this._resetImage(image);
			}.bind(this));
		},

		/**
		 * 画像を読み込む。
		 * @param {Function} callback(image)
		 */
		_loadImage: function(callback) {
			var image = new Image();
			image.onload = function() {
				callback(image);
			};
			image.src = './red-leaves.jpg';
		},

		/**
		 * canvasに画像を出力する。
		 * @param {Image} image
		 */
		_resetImage: function(image) {
			this._resetImageSize(image);
			this._drawImage(image);
		},

		/**
		 * canvasのサイズを画像に合わせる。
		 * @param {Image} image
		 */
		_resetImageSize: function(image) {
			var elCanvas = this.elCanvas;
			elCanvas.width = image.width;
			elCanvas.height = image.height;
		},

		/**
		 * canvasに画像を描画する。
		 * @param {Image} image
		 */
		_drawImage: function(image) {
			var c = this.canvasContext;
			c.drawImage(image, 0, 0);
		},

		/**
		 * RGBを入れ替える。
		 * @param {string} from 交換対象の色。"r", "g", "b"のいずれか。
		 * @param {string} to 交換対象の色。"r", "g", "b"のいずれか。
		 */
		switchColor: function(from, to) {
			var c = this.canvasContext;
			var imageData = this._createSwitchedImageData(from, to);
			c.putImageData(imageData, 0, 0);
		},

		/**
		 * 色交換後のImageDataを作成する。
		 * @param {string} from 交換対象の色。"r", "g", "b"のいずれか。
		 * @param {string} to 交換対象の色。"r", "g", "b"のいずれか。
		 */
		_createSwitchedImageData: function(from, to) {
			var e = this.elCanvas;
			var c = this.canvasContext;
			var width = e.width;
			var height = e.height;

			var imageData = c.getImageData(0, 0, width, height);
			var d = imageData.data;

			var fPos = this._getColorPosition(from);
			var tPos = this._getColorPosition(to);

			for (var y=0; y<height; y++) {
				var offsetY = width * y * 4;
				for (var x=0; x<width; x++) {
					var offset = offsetY + x*4;
					var tmp = d[offset + tPos];
					d[offset + tPos] = d[offset + fPos];
					d[offset + fPos] = tmp;
				}
			}

			return imageData;
		},

		/**
		 * 色の名前から、ImageDataの画素情報の並び位置を返す。
		 * （配列にR, G, B, A, R, G, B, A, ...の順に並んでいる。）
		 * @param {string} color 色。"r", "g", "b"のいずれか。
		 */
		_getColorPosition: function(color) {
			var position;
			if (color === 'r') {
				position = 0;
			}
			else if (color === 'g') {
				position = 1;
			}
			else if (color === 'b') {
				position = 2;
			}
			return position;
		},

		onclickReset: function(event) {
			this.reset();
		},

		onclickSwitchColor: function(event) {
			var $button = $(event.currentTarget);
			var from = $button.attr('data-from');
			var to = $button.attr('data-to');
			this.switchColor(from, to);
		}
	};

	// ----------------------------------------------------------------

	$(function() {
		controller.start();
	});
})();
