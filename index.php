<!DOCTYPE html>
<html>
    <head>
        <meta charset=utf-8 />
        <title>HTML5 Sitemapper</title>
        <!--[if IE]>
        <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.8.0r4/build/reset/reset-min.css" />
        <link rel="stylesheet" type="text/css" href="css/screen.css" media="screen, print" />
    </head>

    <body>
		<div id="navigation">		
			<ul>
				<li>File</li>
				<li>Edit</li>
				<li>View</li>
			</ul>
			<input results='10' type='search' placeholder="Help" /> 
		</div>
		<div id="map"></div>
		<div class="overlay">
			<div id='node-editor'>
				<form>
					<input class="title" type='text' />
				</form>
			</div>
		</div>
		<script src="js/raphael.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js"></script>
		<script src="js/skookum.jsutil.js"></script>
		<script src="js/jquery.sitemap.js"></script>
		<script src="js/site.sitemap.js"></script>
		
    </body>
</html>